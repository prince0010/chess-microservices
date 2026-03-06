import Log from "@/models/Log"
import { endOfDay, parseISO, startOfDay } from "date-fns"

// Fetch Log Datatable Data
const fetchLogTable = async ({
  first = 10,
  after,
  search,
  filter,
  sort = { key: "_id", order: "DESC" },
}: {
  first?: number
  after?: string
  search?: string
  filter?: [{ key: string; term: string; type: "TEXT" | "SELECT" | "DATE" }]
  sort?: {
    key: string
    order: "ASC" | "DESC"
  }
}) => {
  const matchStage: Record<string, any> = {}

  // Handle Global Search
  if (search)
    matchStage.$or = [
      { "user.firstName": { $regex: search, $options: "i" } },
      { "user.lastName": { $regex: search, $options: "i" } },
      {
        $expr: {
          $regexMatch: {
            input: {
              $concat: ["$user.firstName", " ", "$user.lastName"],
            },
            regex: search,
            options: "i",
          },
        },
      },
      { action: { $regex: search, $options: "i" } },
    ]

  // Handle column filtering
  if (filter && filter.length > 0)
    matchStage.$and = filter.map(({ key, term, type }) => {
      switch (type) {
        case "TEXT":
          if (key === "user") {
            return {
              $or: [
                { "user.firstName": { $regex: term, $options: "i" } },
                { "user.lastName": { $regex: term, $options: "i" } },
                {
                  $expr: {
                    $regexMatch: {
                      input: {
                        $concat: ["$user.firstName", " ", "$user.lastName"],
                      },
                      regex: term,
                      options: "i",
                    },
                  },
                },
              ],
            }
          }
          return { [key]: { $regex: term, $options: "i" } }
        case "DATE":
          // Date Range Filtering
          const dates = term.split("_")
          if (dates.length !== 2) throw new Error("Invalid date range format")
          const from = startOfDay(parseISO(dates[0]))
          const to = endOfDay(parseISO(dates[1]))
          return { [key]: { $gte: from, $lte: to } }
        case "SELECT":
          // Select Filtering
          return {
            [key]: term === "true" ? true : term === "false" ? false : term,
          }
      }
    })

  // Handle Pagination
  if (after) {
    const doc = await Log.findById(after)
    if (doc && sort.key) {
      // Sort determines the direction of the cursor and the key to use
      matchStage[sort.key] = {
        [sort.order === "ASC" ? "$gt" : "$lt"]:
          doc[sort.key as keyof typeof doc],
      }
    }
  }

  // Execute aggregation
  const logs = await Log.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    { $match: matchStage },
    { $sort: { [sort.key]: sort.order == "ASC" ? 1 : -1 } },
    { $limit: first + 1 },
    {
      $project: {
        _id: 1,
        user: 1,
        action: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ])

  // Map the results to edges
  const edges = logs.slice(0, first > 0 ? first : logs.length).map((log) => ({
    node: log,
    cursor: log._id.toString(),
  }))

  // Remove the cursor condition from the match stage to get the actual total count
  const totalStage = { ...matchStage }
  if (totalStage[sort.key]) {
    delete totalStage[sort.key]
  }
  const total = await Log.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    { $match: totalStage },
    { $count: "count" },
  ])
  const totalCount = total.length > 0 ? total[0].count : 0

  return {
    edges,
    pageInfo: {
      total: totalCount,
      hasNextPage: logs.length > first,
      endCursor: edges.length
        ? edges[edges.length - 1].node._id.toString()
        : null,
    },
  }
}

const logService = {
  fetchLogTable,
}

export default logService

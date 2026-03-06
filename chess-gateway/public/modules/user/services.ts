// modules/user/services.ts
import User from "@/models/User";
import { ObjectId } from "mongoose";
import { IUserInput } from "./interfaces";
import bcrypt from "bcryptjs";
import { endOfDay, parseISO, startOfDay } from "date-fns";

// NEW: Fetch User By Username
const fetchUserByUsername = async (username: string) => {
  console.log("Service - Fetching user by username:", username);
  const user = await User.findOne({ username });
  if (!user) throw new Error("User not found");
  const { password: _removedPassword, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};

// Fetch User By ID
const fetchUserById = async (id: string) => {
  const user = await User.findOne({ _id: id });
  if (!user) throw new Error("User not found");
  const { password: _removedPassword, ...authUser } = user.toObject();
  return authUser;
};

// Fetch All Users
const fetchAllUsers = async () => User.find();

// Fetch User Options
const fetchUserOptions = async () => {
  const users = await User.find({ status: true });
  return users.map((user) => ({
    label: `${user.lastName}, ${user.firstName}`,
    value: user._id,
  }));
};

// Fetch User Datatable Data
const fetchUserTable = async ({
  first = 10,
  after,
  search,
  filter,
  sort = { key: "_id", order: "DESC" },
}: {
  first?: number;
  after?: string;
  search?: string;
  filter?: [{ key: string; term: string; type: "TEXT" | "SELECT" | "DATE" }];
  sort?: {
    key: string;
    order: "ASC" | "DESC";
  };
}) => {
  const matchStage: Record<string, any> = {};

  if (search) {
    matchStage.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { role: { $regex: search, $options: "i" } },
      {
        $expr: {
          $regexMatch: {
            input: { $concat: ["$firstName", " ", "$lastName"] },
            regex: search,
            options: "i",
          },
        },
      },
    ];
  }

  // Handle column filtering
  if (filter && filter.length > 0)
    matchStage.$and = filter.map(({ key, term, type }) => {
      switch (type) {
        case "TEXT":
          if (key === "fullName") {
            return {
              $or: [
                { firstName: { $regex: term, $options: "i" } },
                { lastName: { $regex: term, $options: "i" } },
                {
                  $expr: {
                    $regexMatch: {
                      input: { $concat: ["$firstName", " ", "$lastName"] },
                      regex: term,
                      options: "i",
                    },
                  },
                },
              ],
            };
          }
          return { [key]: { $regex: term, $options: "i" } };
        case "DATE":
          // Date Range Filtering
          const dates = term.split("_");
          if (dates.length !== 2) throw new Error("Invalid date range format");
          const from = startOfDay(parseISO(dates[0]));
          const to = endOfDay(parseISO(dates[1]));
          return { [key]: { $gte: from, $lte: to } };
        case "SELECT":
          // Select Filtering
          return {
            [key]: term === "true" ? true : term === "false" ? false : term,
          };
      }
    });

  // Handle Pagination
  if (after) {
    const doc = await User.findById(after);
    if (doc && sort.key) {
      matchStage[sort.key] = {
        [sort.order === "ASC" ? "$gt" : "$lt"]:
          doc[sort.key as keyof typeof doc],
      };
    }
  }

  // Execute aggregation
  const users = await User.aggregate([
    { $match: matchStage },
    { $sort: { [sort.key]: sort.order == "ASC" ? 1 : -1 } },
    { $limit: first + 1 },
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        username: 1,
        email: 1,
        role: 1,
        status: 1,
        isActive: 1,
      },
    },
  ]);

  // Map the results to edges
  const edges = users
    .slice(0, first > 0 ? first : users.length)
    .map((user) => ({
      node: user,
      cursor: user._id.toString(),
    }));

  // Remove the cursor condition from the match stage to get the actual total count
  const totalStage = { ...matchStage };
  if (totalStage[sort.key]) {
    delete totalStage[sort.key];
  }
  const total = await User.aggregate([
    { $match: totalStage },
    { $count: "count" },
  ]);
  const totalCount = total.length > 0 ? total[0].count : 0;

  return {
    edges,
    pageInfo: {
      total: totalCount,
      hasNextPage: users.length > first,
      endCursor: edges.length
        ? edges[edges.length - 1].node._id.toString()
        : null,
    },
  };
};

// Create User
const createUser = async (input: IUserInput) =>
  await User.create({
    ...input,
    password: await bcrypt.hash(input.username, 10),
  });

// Update User
const updateUser = async (id: ObjectId, input: IUserInput) =>
  await User.findByIdAndUpdate(id, input, { new: true });

// Change User Status
const changeUserStatus = async (id: ObjectId, status: boolean) =>
  await User.findByIdAndUpdate(id, { status }, { new: true });

const deleteUser = async (id: ObjectId) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error("User not found");
  return user;
};

const deleteMultipleUsers = async (ids: ObjectId[]) => {
  const result = await User.deleteMany({ _id: { $in: ids } });
  return result.deletedCount;
};

const userService = {
  fetchUserById,
  fetchUserByUsername,
  fetchAllUsers,
  fetchUserOptions,
  fetchUserTable,
  createUser,
  updateUser,
  changeUserStatus,
  deleteUser,
  deleteMultipleUsers,
};

export default userService;
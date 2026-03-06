import logService from "./services"
import { IContext } from "../shared/interfaces"

const logResolvers = {
  Query: {
    fetchLogTable: async (
      _: any,
      params: {
        first?: number
        after?: string
        search?: string
        filter?: [
          { key: string; term: string; type: "TEXT" | "SELECT" | "DATE" }
        ]
        sort?: {
          key: string
          order: "ASC" | "DESC"
        }
      },
      ctx: IContext
    ) => {
      if (!ctx?.session) throw new Error("Unauthenticated")
      try {
        const logTable = await logService.fetchLogTable(params)
        if (!logTable) throw new Error("No log table data found")
        return logTable
      } catch (error) {
        console.error(error)
        throw new Error("Failed to fetch log table")
      }
    },
  },
}

export default logResolvers

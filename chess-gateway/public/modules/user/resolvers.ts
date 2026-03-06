// modules/user/resolvers.ts
import { ObjectId } from "mongoose";
import userService from "./services";
import { IContext } from "../shared/interfaces";
import Log from "@/models/Log";
import { sseStore } from "@/lib/sse-store";

const userResolvers = {
  Query: {
    fetchUser: async (_: any, { _id }: { _id: string }, ctx: IContext) => {
      // if (!ctx?.session) throw new Error("Unauthenticated");
      try {
        const user = await userService.fetchUserById(_id);
        if (!user) throw new Error("User not found");
        return user;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch user");
      }
    },

    // NEW: Fetch user by username
    fetchUserByUsername: async (_: any, { username }: { username: string }, ctx: IContext) => {
      if (!ctx?.session) throw new Error("Unauthenticated");
      try {
        console.log("Fetching user by username:", username);
        const user = await userService.fetchUserByUsername(username);
        if (!user) throw new Error("User not found");
        return user;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch user by username");
      }
    },

    fetchUsers: async (_: any, __: any, ctx: IContext) => {
      // if (!ctx?.session) throw new Error("Unauthenticated");
      try {
        const users = await userService.fetchAllUsers();
        if (!users) throw new Error("No users found");
        return users;
      } catch (error: any) {
        console.error(error);
        throw new Error(error.toString());
      }
    },
    fetchUserOptions: async (_: any, __: any, ctx: IContext) => {
      // if (!ctx?.session) throw new Error("Unauthenticated");
      try {
        const options = await userService.fetchUserOptions();
        if (!options) throw new Error("No user options found");
        return options;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch user options");
      }
    },
    fetchUserTable: async (
      _: any,
      params: {
        first?: number;
        after?: string;
        search?: string;
        filter?: [
          { key: string; term: string; type: "TEXT" | "SELECT" | "DATE" }
        ];
        sort?: {
          key: string;
          order: "ASC" | "DESC";
        };
      },
      ctx: IContext
    ) => {
      // if (!ctx?.session) throw new Error("Unauthenticated");
      try {
        const userTable = await userService.fetchUserTable(params);
        if (!userTable) throw new Error("No user table data found");
        return userTable;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch user table");
      }
    },
  },
  Mutation: {
    createUser: async (_: any, { input }: { input: any }, ctx: IContext) => {
      if (!ctx?.session) throw new Error("Unauthenticated");
      const sessionUser = ctx.session.user;

      try {
        const user = await userService.createUser(input);
        if (!user) throw new Error("Failed to create user");

        await Log.create({
          user: sessionUser._id as unknown as ObjectId,
          action: `User created: ${user.firstName} ${user.lastName}.`,
        });

        // Send SSE notification using the store
        const eventData = {
          type: "USER_UPDATE",
          payload: {
            refetch: true,
            message: `${sessionUser.firstName} ${sessionUser.lastName} created user: ${user.firstName} ${user.lastName}`,
            roles: ["admin", "coach"],
            receivers: [sessionUser._id.toString()],
          },
        }

        console.log("Broadcasting USER_UPDATE event:", eventData);

        // Broadcast to all connected clients
        sseStore.broadcast(eventData);

        return {
          ok: true,
          message: "User created successfully",
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to create user");
      }
    },

    updateUser: async (_: any, { input }: { input: any }, ctx: IContext) => {
      if (!ctx?.session) throw new Error("Unauthenticated");
      const sessionUser = ctx.session.user;

      try {
        const user = await userService.updateUser(input._id, input);
        if (!user) throw new Error("Failed to update user");

        await Log.create({
          user: sessionUser._id as unknown as ObjectId,
          action: `User updated: ${user.firstName} ${user.lastName}.`,
        });

        // Send SSE notification using the store
        const eventData = {
          type: "USER_UPDATE",
          payload: {
            refetch: true,
            message: `${sessionUser.firstName} ${sessionUser.lastName} updated user: ${user.firstName} ${user.lastName}`,
            roles: ["admin", "coach"],
            receivers: [sessionUser._id.toString(), user._id.toString()],
          },
        };

        console.log("Broadcasting USER_UPDATE event:", eventData);
        sseStore.broadcast(eventData);

        return {
          ok: true,
          message: "User updated successfully",
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to update user");
      }
    },

    deleteUser: async (_: any, { _id }: { _id: string }, ctx: IContext) => {
      if (!ctx?.session) throw new Error("Unauthenticated");
      const sessionUser = ctx.session.user;

      try {
        const user = await userService.deleteUser(_id as unknown as ObjectId);
        if (!user) throw new Error("Failed to delete user");

        await Log.create({
          user: sessionUser._id as unknown as ObjectId,
          action: `User deleted: ${user.firstName} ${user.lastName}.`,
        });

        const eventData = {
          type: "USER_DELETE",
          payload: {
            refetch: true,
            message: `${sessionUser.firstName} ${sessionUser.lastName} deleted user: ${user.firstName} ${user.lastName}`,
            roles: ["admin", "coach"],
            receivers: [sessionUser._id.toString()],
          },
        };

        console.log("Broadcasting USER_DELETE event:", eventData);
        sseStore.broadcast(eventData);

        return {
          ok: true,
          message: "User deleted successfully",
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to delete user");
      }
    },

    changeUserStatus: async (
      _: any,
      { _id, status }: { _id: ObjectId; status: boolean },
      ctx: IContext
    ) => {
      if (!ctx?.session) throw new Error("Unauthenticated");
      const sessionUser = ctx.session.user;

      try {
        const user = await userService.changeUserStatus(_id, status);
        if (!user) throw new Error("Failed to change user status");

        await Log.create({
          user: sessionUser._id as unknown as ObjectId,
          action: `User status changed to ${status} successfully`,
        });

        const eventData = {
          type: "USER_UPDATE",
          payload: {
            refetch: true,
            message: `${sessionUser.firstName} ${sessionUser.lastName} changed user status to ${status} for ${user.firstName} ${user.lastName}`,
            roles: ["admin", "coach"],
            receivers: [sessionUser._id.toString(), user._id.toString()],
          },
        };

        console.log("Broadcasting USER_UPDATE event:", eventData);
        sseStore.broadcast(eventData);

        return {
          ok: true,
          message: `User status changed to ${status} successfully`,
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to change user status");
      }
    },
    deleteMultipleUsers: async (
      _: any,
      { ids }: { ids: ObjectId[] },
      ctx: IContext
    ) => {
      if (!ctx?.session) throw new Error("Unauthenticated");
      const user = ctx.session.user;

      try {
        const deletedCount = await userService.deleteMultipleUsers(ids);

        if (deletedCount === 0) {
          throw new Error("No users were deleted");
        }

        await Log.create({
          user: user._id as unknown as ObjectId,
          action: `Deleted ${deletedCount} users in batch`,
        });

        // Send SSE notification for batch delete
        const eventData = {
          type: "USER_DELETE",
          payload: {
            refetch: true,
            message: `${user.firstName} ${user.lastName} deleted ${deletedCount} users`,
            roles: ["admin", "coach", "user"],
            receivers: [user._id.toString()],
          },
        };

        console.log("Broadcasting USER_DELETE event:", eventData);
        sseStore.broadcast(eventData);

        return {
          ok: true,
          message: `Successfully deleted ${deletedCount} user${deletedCount > 1 ? "s" : ""
            }`,
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to delete users");
      }
    },
  },
};

export default userResolvers;
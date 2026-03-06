// modules/auth/resolvers.ts
import { ObjectId } from "mongoose";
import authService from "./services";
import { IContext } from "../shared/interfaces";
import { events } from "@/lib/events";
import Log from "@/models/Log";

const authResolvers = {
  Mutation: {
    loginUser: async (
      _: any,
      { identifier, password }: { identifier: string; password: string }
    ) => {
      try {
        console.log("Login resolver called with identifier:", identifier);
        const user = await authService.loginUser(identifier, password);
        if (!user) throw new Error("Invalid credentials");

        console.log("Login successful for user:", user.email, "role:", user.role);

        await Log.create({
          user: user._id as unknown as ObjectId,
          action: "User logged in.",
        });

        return {
          ok: true,
          message: "Login successful",
          user,
        };
      } catch (error) {
        console.error("Login error:", error);
        throw new Error("Failed to login user");
      }
    },
    changePassword: async (
      _: any,
      { _id, newPassword }: { _id: string; newPassword: string },
      ctx: IContext
    ) => {
      if (!ctx?.session) throw new Error("Unauthenticated");
      try {
        const user = await authService.changePassword(_id, newPassword);
        if (!user) throw new Error("Failed to change password");

        events.emit("update", {
          type: "USER_UPDATE",
          payload: {
            refetch: true,
            message:
              user?._id != ctx.session.user._id
                ? `${ctx.session.user.firstName} ${ctx.session.user.lastName} changed the password for user: ${user.firstName} ${user.lastName}.`
                : `${user.firstName} ${user.lastName} changed their password.`,
            roles: ["admin", "hr"],
            receivers: [user._id.toString()],
          },
        });

        return {
          ok: true,
          message: "Password change successfully",
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to change password");
      }
    },
  },
};

export default authResolvers;
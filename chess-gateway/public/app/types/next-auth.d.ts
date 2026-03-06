import "next-auth";

declare module "next-auth" {
    interface User {
        _id?: string;
        firstName?: string;
        lastName?: string;
        username?: string;
        email?: string;
        role?: string;
        coachId?: string;
        status?: boolean;
        isActive?: boolean;
    }

    interface Session {
        user: {
            _id?: string;
            firstName?: string;
            lastName?: string;
            username?: string;
            email?: string;
            role?: string;
            coachId?: string;
            status?: boolean;
            isActive?: boolean;
            name?: string | null;
            image?: string | null;
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user?: {
            _id?: string;
            firstName?: string;
            lastName?: string;
            username?: string;
            email?: string;
            role?: string;
            coachId?: string;
            status?: boolean;
            isActive?: boolean;
        };
        coachId?: string;
    }
}
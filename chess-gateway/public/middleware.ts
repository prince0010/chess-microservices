import { JWT } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { IUser } from "./modules/user/interfaces"
import { TRole } from "./modules/shared/interfaces"

const routePermissions = [
  {
    path: "/dashboard",
    allowedRoles: ["admin"],
  },
  {
    path: "/users",
    allowedRoles: ["admin"],
  },
  {
    path: "/log",
    allowedRoles: ["admin"],
  },
  {
    path: "/coach-dashboard",
    allowedRoles: ["coach"],
  },
  {
    path: "/users-dashboard",
    allowedRoles: ["user"],
  },
  {
    path: "/applicants",
    allowedRoles: ["admin"],
  },
]

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token as JWT & { user?: IUser }
    const role = token?.user?.role

    console.log("Middleware - Path:", pathname, "Role:", role);

    const isAuthorized = (path: string, userRole: string | undefined) =>
      routePermissions.some(
        (route) =>
          path.startsWith(route.path) &&
          (route.allowedRoles.includes("*") ||
            (userRole && route.allowedRoles.includes(userRole)))
      )

    // Allow everyone (authenticated or not) to access the root path "/"
    if (pathname === "/") {
      return NextResponse.next()
    }

    // Redirect authenticated users away from login
    if (pathname === "/login" && token) {
      console.log("User already logged in, redirecting based on role");
      if (role === "coach") {
        return NextResponse.redirect(new URL("/coach-dashboard", req.url))
      } else if (role === "user") {
        return NextResponse.redirect(new URL("/users-dashboard", req.url))
      } else if (role === "admin") {
        return NextResponse.redirect(new URL("/applicants", req.url))
      }
    }

    // Allow public paths
    if (pathname === "/login") {
      return NextResponse.next()
    }

    // Check if user is authenticated for protected routes
    if (!token) {
      console.log("Unauthenticated access attempt, redirecting to login");
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Check authorization for protected routes
    if (!isAuthorized(pathname, role)) {
      console.log("Unauthorized access attempt, redirecting to appropriate dashboard");
      if (role === "coach") {
        return NextResponse.redirect(new URL("/coach-dashboard", req.url))
      } else if (role === "user") {
        return NextResponse.redirect(new URL("/users-dashboard", req.url))
      } else if (role === "admin") {
        return NextResponse.redirect(new URL("/applicants", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
)

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
    "/coach-dashboard/:path*",
    "/users-dashboard/:path*",
    "/log/:path*",
    "/users/:path*",
    "/supplier/:path*",
    "/credit/:path*",
    "/products/:path*",
    "/product_type/:path*",
    "/applicants/:path*",
  ],
}
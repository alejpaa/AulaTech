import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { isAppRole, roleHomePath } from "@/lib/auth/roles";

const protectedPrefixes = ["/admin", "/profesor", "/alumno"];
const roleByPrefix = {
  "/admin": "administrativo",
  "/profesor": "profesor",
  "/alumno": "alumno",
} as const;

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user) {
    const { data: profile } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("auth_user_id", user.id)
      .eq("activo", true)
      .single();

    const role = profile?.rol;

    if (pathname === "/login" && isAppRole(role)) {
      return NextResponse.redirect(new URL(roleHomePath(role), request.url));
    }

    for (const [prefix, requiredRole] of Object.entries(roleByPrefix)) {
      if (pathname.startsWith(prefix) && role !== requiredRole) {
        return NextResponse.redirect(new URL(isAppRole(role) ? roleHomePath(role) : "/login", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

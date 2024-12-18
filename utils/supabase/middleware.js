import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export const updateSession = async (request) => {
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Refresh session if expired - required for Server Components
    const user = await supabase.auth.getUser();

    // console.log(user);

    // Protected routes
    // if (request.nextUrl.pathname.startsWith("/protected") && user.error) {
    //   return NextResponse.redirect(new URL("/sign-in", request.url));
    // }

    if (request.nextUrl.pathname === "/sign-in" && !user.error) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // if (request.nextUrl.pathname === "/results" && user.error) {
    //   return NextResponse.redirect(new URL("/sign-in", request.url));
    // }

    return response;
  } catch (e) {
    // If a Supabase client could not be created, likely due to missing environment variables
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};

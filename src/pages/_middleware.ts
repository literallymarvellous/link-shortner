import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  if (req.nextUrl.pathname.startsWith("/api/get-url")) {
    console.log("returning early");
    return;
  }

  console.log(req.nextUrl.pathname);

  const slug = req.nextUrl.pathname.split("/").pop();

  const data = await (
    await fetch(`${req.nextUrl.origin}/api/get-url/${slug}`)
  ).json();

  if (data?.url) {
    return NextResponse.redirect(data.url);
  }

  console.log("data:", data);
}

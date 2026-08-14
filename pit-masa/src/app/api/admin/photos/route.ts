import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAuthenticated } from "@/lib/admin/auth";
import { listMedia } from "@/lib/admin/store";

/** Lists photos the client can choose from: their uploads + the built-in library. */
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const uploaded = (await listMedia()).map((key) => `/media/${key}`);

  let library: string[] = [];
  try {
    const dir = path.join(process.cwd(), "public", "images", "jewelry");
    const files = await fs.readdir(dir);
    library = files
      .filter((f) => /\.(webp|jpe?g|png|avif)$/i.test(f))
      .sort()
      .map((f) => `/images/jewelry/${f}`);
  } catch {
    library = [];
  }

  return NextResponse.json({ uploaded, library });
}

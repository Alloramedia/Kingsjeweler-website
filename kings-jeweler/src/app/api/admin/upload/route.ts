import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { isAuthenticated } from "@/lib/admin/auth";
import { writeMedia } from "@/lib/admin/store";

const MAX_BYTES = 12 * 1024 * 1024; // 12 MB raw upload cap
const MAX_WIDTH = 1600;

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  let file: File | null = null;
  try {
    const form = await request.formData();
    const f = form.get("file");
    if (f instanceof File) file = f;
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ error: "No photo was provided." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "That file isn't a photo." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "That photo is too large. Please use one under 12 MB." },
      { status: 400 },
    );
  }

  let optimized: Buffer;
  try {
    const input = Buffer.from(await file.arrayBuffer());
    optimized = await sharp(input)
      .rotate() // respect EXIF orientation from phone photos
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  } catch {
    return NextResponse.json(
      { error: "We couldn't process that photo. Try a different one." },
      { status: 400 },
    );
  }

  const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  await writeMedia(key, optimized, "image/webp");

  return NextResponse.json({ url: `/media/${key}` });
}

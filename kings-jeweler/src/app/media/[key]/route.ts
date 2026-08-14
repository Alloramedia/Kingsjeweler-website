import { NextRequest, NextResponse } from "next/server";
import { readMedia } from "@/lib/admin/store";

/**
 * Serves uploaded photos (stored in Netlify Blobs in production, or on disk
 * locally). Images are immutable — each upload gets a unique filename — so we
 * can cache aggressively. Public on purpose: these are site images.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;

  // Only allow the filenames we generate: timestamp-rand.webp
  if (!/^[a-z0-9]+-[a-z0-9]+\.webp$/i.test(key)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const media = await readMedia(key);
  if (!media) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(media.body as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": media.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

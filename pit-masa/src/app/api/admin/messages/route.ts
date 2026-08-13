import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import {
  readMessages,
  setMessageRead,
  setMessageStatus,
  deleteMessage,
} from "@/lib/admin/store";
import type { MessageStatus } from "@/lib/admin/types";

const STATUSES: MessageStatus[] = ["new", "quoted", "booked", "archived"];

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const messages = await readMessages();
  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  let id: string;
  let action: string;
  let status: string;
  try {
    const body = await request.json();
    id = String(body?.id ?? "");
    action = String(body?.action ?? "");
    status = String(body?.status ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }

  switch (action) {
    case "read":
      await setMessageRead(id, true);
      break;
    case "unread":
      await setMessageRead(id, false);
      break;
    case "status":
      if (!STATUSES.includes(status as MessageStatus)) {
        return NextResponse.json({ error: "Unknown status." }, { status: 400 });
      }
      await setMessageStatus(id, status as MessageStatus);
      break;
    case "delete":
      await deleteMessage(id);
      break;
    default:
      return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

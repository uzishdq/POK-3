// app/api/send-pending-notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq, and, isNotNull } from "drizzle-orm";
import { notificationsTable } from "@/lib/db/schema";
import { notifWa } from "@/lib/ruang-wa";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== process.env.CRON_SECRET!) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const pending = await db
      .select()
      .from(notificationsTable)
      .where(
        and(
          eq(notificationsTable.statusNotification, "PENDING"),
          isNotNull(notificationsTable.noTelpNotification)
        )
      )
      .limit(10);

    if (pending.length === 0) {
      return NextResponse.json({ message: "No pending notifications" });
    }

    const results = [];

    for (const notif of pending) {
      const phone = notif.noTelpNotification;
      const message = notif.messageNotification;

      // Validasi tambahan (format nomor)
      if (!phone || !/^\d{10,15}$/.test(phone)) {
        results.push({
          id: notif.idNotification,
          status: "FAILED",
          reason: "Invalid or missing phone number",
        });
        continue;
      }

      try {
        const success = await notifWa({
          noTelpNotification: phone,
          messageNotification: message,
        });

        if (success) {
          await db
            .update(notificationsTable)
            .set({ statusNotification: "SENT" })
            .where(eq(notificationsTable.idNotification, notif.idNotification));

          results.push({ id: notif.idNotification, status: "SENT" });
        } else {
          results.push({
            id: notif.idNotification,
            status: "FAILED",
            reason: "Failed to send via WA",
          });
        }
      } catch (err) {
        console.error(`Error sending to ${phone}:`, err);
        results.push({
          id: notif.idNotification,
          status: "FAILED",
          error: (err as Error).message,
        });
      }
    }

    return NextResponse.json({
      message: "Processed notifications",
      results,
    });
  } catch (err) {
    console.error("Failed to send notifications:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

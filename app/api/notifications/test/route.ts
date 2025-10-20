import { cekNotifWa } from "@/lib/ruang-wa";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const notif = await cekNotifWa();

    return NextResponse.json(notif);
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

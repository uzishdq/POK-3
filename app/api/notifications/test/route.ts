import { cekNotifWa } from "@/lib/ruang-wa";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const notif = await cekNotifWa();

    console.log(notif);

    return NextResponse.json({ message: "Berhasil " });
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

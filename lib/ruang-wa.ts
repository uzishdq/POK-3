"use server";

import { TNotifikasi } from "./types/notifikasi";

function generatePhoneNumber(phoneNumber: string): string {
  if (phoneNumber.startsWith("0")) {
    return `62${phoneNumber.slice(1)}`;
  } else if (phoneNumber.startsWith("62")) {
    return phoneNumber;
  } else if (phoneNumber.startsWith("+62")) {
    return phoneNumber.slice(1);
  } else {
    return phoneNumber;
  }
}

export const cekNotifWa = async () => {
  const notif = await fetch(process.env.RUANGWA_CEK!, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      token: process.env.RUANGWA_TOKEN!,
    }),
  });

  const response = await notif.json();

  if (response.result === "true") {
    return { ok: true, message: response.message };
  } else {
    console.log("error cek notif : ", response.message);
    return {
      ok: false,
      message:
        "Tidak dapat terhubung ke WhatsApp. Layanan belum diperpanjang. Periksa langganan Anda atau hubungi tim dukungan.",
    };
  }
};

export const notifWa = async ({
  noTelpNotification,
  messageNotification,
}: TNotifikasi) => {
  const cek = await cekNotifWa();

  if (!cek.ok) return false;

  const notif = await fetch(process.env.RUANGWA_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      token: process.env.RUANGWA_TOKEN!,
      number: generatePhoneNumber(noTelpNotification),
      message: messageNotification,
    }),
  });

  const response = await notif.json();
  if (response.result) {
    return true;
  } else {
    console.log("error kirim notif : ", response.message);
    return false;
  }
};

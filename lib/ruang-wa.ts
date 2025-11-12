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

// export const cekNotifWa = async () => {
//   const notif = await fetch(process.env.RUANGWA_CEK!, {
//     method: "POST",
//     headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     body: new URLSearchParams({
//       token: process.env.RUANGWA_TOKEN!,
//     }),
//   });

//   const response = await notif.json();

//   if (response.result === "true") {
//     return { ok: true, message: response.message };
//   } else {
//     console.log("error cek notif : ", response.message);
//     return {
//       ok: false,
//       message:
//         "Tidak dapat terhubung ke WhatsApp. Layanan belum diperpanjang. Periksa langganan Anda atau hubungi tim dukungan.",
//     };
//   }
// };

export const cekNotifWa = async () => {
  const url = process.env.RUANGWA_CEK;
  const token = process.env.RUANGWA_TOKEN;

  // 1. Validasi Environment
  if (!url || !token) {
    console.error("[WA] Missing RUANGWA_CEK or RUANGWA_TOKEN in environment");
    return {
      ok: false,
      message: "Konfigurasi WhatsApp API tidak lengkap. Hubungi admin.",
    };
  }

  try {
    // 2. Fetch dengan timeout & header lengkap
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 detik timeout

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "User-Agent": "NextJS-Vercel/15",
      },
      body: new URLSearchParams({ token }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // 3. Cek status HTTP
    if (!res.ok) {
      const text = await res.text();
      console.error(`[WA] HTTP ${res.status} - ${text}`);
      return {
        ok: false,
        message: "Server WhatsApp tidak merespons dengan benar.",
      };
    }

    // 4. Parse JSON dengan aman
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any;
    try {
      data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (jsonError) {
      const text = await res.text();
      console.error("[WA] Invalid JSON response:", text.slice(0, 300));
      return {
        ok: false,
        message: "Format data dari WhatsApp tidak valid.",
      };
    }

    // 5. Validasi respons RuangWA
    if (data.result === "true" || data.result === true) {
      console.log("[WA] Koneksi WhatsApp: BERHASIL");
      return {
        ok: true,
        message: "WhatsApp siap digunakan",
        data: data, // optional: untuk debug
      };
    } else {
      console.warn("[WA] Koneksi gagal:", data.message);
      return {
        ok: false,
        message: "Tidak dapat terhubung ke WhatsApp.",
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // 6. Tangkap semua error (network, timeout, dll)
    if (error.name === "AbortError") {
      console.error("[WA] Request timeout setelah 8 detik");
      return {
        ok: false,
        message: "Koneksi ke WhatsApp terlalu lambat.",
      };
    }

    console.error("[WA] Unexpected error:", error.message || error);
    return {
      ok: false,
      message: "Layanan WhatsApp sedang bermasalah. Coba lagi nanti.",
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

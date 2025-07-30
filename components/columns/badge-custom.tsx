import { Badge } from "@/components/ui/badge";

interface BadgeCustomProps {
  value: string;
  category:
    | "statusAnggota"
    | "statusPendaftaranSimpanan"
    | "jenisSimpanan"
    | "statusPinjaman"
    | "statusNotifikasi"
    | "statusPengambilanSimpanan"
    | "jenisPinjaman"
    | "jenisPelunasanPinjaman";
}

const statusStyleMap: Record<
  BadgeCustomProps["category"],
  Record<
    string,
    {
      variant?: "default" | "secondary" | "destructive" | "outline";
      className?: string;
    }
  >
> = {
  statusAnggota: {
    ACTIVE: { variant: "default" },
    NOTACTIVE: { variant: "destructive" },
  },
  statusPendaftaranSimpanan: {
    OPEN: { variant: "default" },
    CLOSE: { variant: "secondary" },
  },
  jenisSimpanan: {
    WAJIB: { className: "bg-blue-100 text-blue-800" },
    SUKAMANA: { className: "bg-green-100 text-green-800" },
    LEBARAN: { className: "bg-yellow-100 text-yellow-800" },
    QURBAN: { className: "bg-red-100 text-red-800" },
    UBAR: { className: "bg-purple-100 text-purple-800" },
  },
  statusPinjaman: {
    PENDING: { variant: "outline" },
    APPROVED: { variant: "default" },
    REJECTED: { variant: "destructive" },
    COMPLETED: { className: "bg-green-100 text-green-800" },
  },
  statusNotifikasi: {
    PENDING: { variant: "outline" },
    FAILED: { variant: "destructive" },
    SENT: { className: "bg-green-100 text-green-800" },
  },

  statusPengambilanSimpanan: {
    PENDING: { variant: "outline" },
    APPROVED: { variant: "default" },
    REJECTED: { variant: "destructive" },
  },
  jenisPinjaman: {
    PRODUKTIF: { className: "bg-emerald-100 text-emerald-800" },
    BARANG: { className: "bg-indigo-100 text-indigo-800" },
  },
  jenisPelunasanPinjaman: {
    CASH: { className: "bg-orange-100 text-orange-800" },
    TRANSFER: { className: "bg-teal-100 text-teal-800" },
  },
};

export function BadgeCustom({ value, category }: BadgeCustomProps) {
  const categoryMap = statusStyleMap[category] || {};
  const style = categoryMap[value] || { variant: "secondary" };

  return (
    <Badge
      variant={style.variant}
      className={`capitalize ${style.className ?? ""}`}
    >
      {value}
    </Badge>
  );
}

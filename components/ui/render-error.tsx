import FormStatus from "../form/form-status";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

function RenderError(header: string, message: string) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">{header}</div>
      <FormStatus message={message} />
    </div>
  );
}

function RenderErrorPengajuanPinjaman(header: string, message: string) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">{header}</div>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            PERSYARATAN PINJAMAN KOPERASI KARYAWAN YAYASAN AL GHIFARI
          </CardTitle>
          <ul className="mt-3 list-decimal pl-4 pt-4 text-sm text-muted-foreground">
            <li className="mb-4 text-justify">
              Besaran pinjaman maksimal adalah 15 kali dari jumlah simpanan
              wajib dan manasuka, dengan catatan besaran pinjaman tidak boleh
              melebihi 50 juta.
            </li>
            <li className="mb-4 text-justify">
              Besaran pinjaman yang dapat disetujui berdasarkan kemampuan
              angsuran masing-masing anggota perbulan dan ketentuan batasan
              minimum “Take Home Pay” (THP) <b>35%</b> dari Gaji Bersih.
            </li>
            <li className="mb-4 text-justify">Struk Gaji terakhir.</li>

            <li className="mb-2 text-justify">
              Biaya yang dikenakan sekali pada saat penarikan :
            </li>
            <ul className="list-disc pl-4">
              <li className="mb-2 text-justify">
                Biaya administrasi sebesar <b>1%</b> dari jumlah pinjaman.
              </li>
              <li className="mb-2 text-justify">
                Biaya premi asuransi jiwa, dihitung berdasarkan usia dan jangka
                waktu pinjaman.
              </li>
            </ul>
          </ul>
        </CardHeader>
        <CardContent>
          <FormStatus message={message} />
        </CardContent>
      </Card>
    </div>
  );
}

export { RenderError, RenderErrorPengajuanPinjaman };

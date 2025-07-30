import { relations } from "drizzle-orm";
import {
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

//JABATAN
export const jabatanTable = pgTable("jabatan", {
  noJabatan: serial("no_jabatan").primaryKey().notNull(),
  namaJabatan: varchar("nama_jabatan", { length: 255 }).notNull(),
});

//UNIT KERJA
export const unitKerjaTable = pgTable("unit_kerja", {
  noUnitKerja: serial("no_unit_kerja").primaryKey().notNull(),
  namaUnitKerja: varchar("nama_unit_kerja", { length: 255 }).notNull(),
  alamatUnitKerja: varchar("alamat_unit_kerja", { length: 255 }).notNull(),
});

//USER
export const userRoleEnum = pgEnum("user_role", [
  "ADMIN",
  "USER",
  "BENDAHARA",
  "SEKRETARIS",
]);

export const statusUserEnum = pgEnum("status_user_role", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const userTable = pgTable("user", {
  idUser: uuid("id_user").primaryKey().defaultRandom(),
  username: varchar("username", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: userRoleEnum("role_user").default("USER").notNull(),
  statusUser: statusUserEnum("status_user_role").default("PENDING").notNull(),
});

//ANGGOTA
export const jenisKelaminAnggotaEnum = pgEnum("jenis_kelamin_anggota", [
  "PRIA",
  "WANITA",
]);

export const statusPekerjaanAnggotaEnum = pgEnum("status_pekerjaan_anggota", [
  "TETAP",
  "KONTRAK",
  "HONORER",
]);

export const statusAnggotaEnum = pgEnum("status_anggota", [
  "ACTIVE",
  "NOTACTIVE",
]);

export const anggotaTable = pgTable("anggota", {
  noAnggota: varchar("no_anggota", { length: 10 }).primaryKey().notNull(),
  username: varchar("username", { length: 255 })
    .notNull()
    .references(() => userTable.username, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  nikAnggota: varchar("nik_anggota", { length: 30 }).unique().notNull(),
  nipAnggota: varchar("nip_anggota", { length: 30 }).unique(),
  namaAnggota: varchar("nama_anggota", { length: 255 }).notNull(),
  tanggalLahirAnggota: date("tanggal_lahir_anggota").notNull(),
  tempatLahirAnggota: varchar("tempat_lahir_anggota", {
    length: 100,
  }).notNull(),
  jenisKelaminAnggota: jenisKelaminAnggotaEnum("jenis_kelamin_anggota")
    .default("PRIA")
    .notNull(),
  alamatAnggota: varchar("alamat_anggota", { length: 255 }).notNull(),
  noTelpAnggota: varchar("telepon_anggota", { length: 20 }),
  statusPekerjaan: statusPekerjaanAnggotaEnum("status_pekerjaan")
    .default("KONTRAK")
    .notNull(),
  jabatanId: integer("jabatan_id")
    .notNull()
    .references(() => jabatanTable.noJabatan),
  unitKerjaId: integer("unit_kerja_id")
    .notNull()
    .references(() => unitKerjaTable.noUnitKerja),
  bankAnggota: varchar("bank_anggota", { length: 100 }),
  rekeningAnggota: varchar("rekening_anggota", { length: 100 }),
  pilihanSukamana: numeric("pilihan_sukamana"),
  statusAnggota: statusAnggotaEnum("status_anggota")
    .notNull()
    .default("ACTIVE"),
});

//SIMPANAN
export const jenisSimpananEnum = pgEnum("jenis_simpanan", [
  "WAJIB",
  "SUKAMANA",
  "LEBARAN",
  "QURBAN",
  "UBAR",
]);

export const simpananTable = pgTable("simpanan", {
  noSimpanan: varchar("no_simpanan", { length: 20 }).primaryKey().notNull(),
  noAnggota: varchar("no_anggota", { length: 10 })
    .notNull()
    .references(() => anggotaTable.noAnggota, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  tanggalSimpanan: date("tanggal_simpanan").notNull().defaultNow(),
  jenisSimpanan: jenisSimpananEnum("jenis_simpanan").default("WAJIB").notNull(),
  jumlahSimpanan: numeric("jumlah_simpanan").notNull(),
});

//PENGAMBILAN SIMPANAN
export const jenisPengambilanSimpananEnum = pgEnum(
  "jenis_pengambilan_simpanan",
  ["WAJIB", "SUKAMANA", "LEBARAN", "QURBAN", "UBAR"]
);

export const statusPengambilanSimpananEnum = pgEnum(
  "status_pengambilan_simpanan",
  ["PENDING", "APPROVED", "REJECTED"]
);

export const pengambilanSimpananTable = pgTable("pengambilan_simpanan", {
  noPengambilanSimpanan: varchar("no_pengambilan_simpanan", { length: 20 })
    .primaryKey()
    .notNull(),
  noAnggota: varchar("no_anggota", { length: 10 })
    .notNull()
    .references(() => anggotaTable.noAnggota, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  tanggalPengambilanSimpanan: date("tanggal_pengambilan_simpanan")
    .notNull()
    .defaultNow(),
  jenisPengambilanSimpanan: jenisPengambilanSimpananEnum(
    "jenis_pengambilan_simpanan"
  )
    .default("WAJIB")
    .notNull(),
  jumlahPengambilanSimpanan: numeric("jumlah_pengambilan_simpanan").notNull(),
  statusPengambilanSimpanan: statusPengambilanSimpananEnum(
    "status_pengambilan_simpanan"
  )
    .default("PENDING")
    .notNull(),
});

//SETTING PENDAFTARAN SIMPANAN
export const jenisPendaftaranSimpananEnum = pgEnum(
  "jenis_pendaftaran_simpanan",
  ["LEBARAN", "QURBAN", "UBAR"]
);

export const statusPendaftaranSimpananEnum = pgEnum(
  "status_pendaftaran_simpanan",
  ["OPEN", "CLOSE"]
);

export const settingPendaftaranSimpananTable = pgTable(
  "setting_pendaftaran_simpanan",
  {
    idSettingPendaftaran: uuid("id_setting_pendaftaran")
      .primaryKey()
      .defaultRandom(),
    namaPendaftaran: varchar("nama_pendaftaran", { length: 255 }).notNull(),
    jenisPendaftaranSimpanan: jenisPendaftaranSimpananEnum(
      "jenis_pendaftaran_simpanan"
    )
      .notNull()
      .default("LEBARAN"),
    tanggalTutupSimpanan: date("tanggal_tutup_simpanan").notNull().defaultNow(),
    tanggalAwalSimpanan: date("tanggal_awal_simpanan").notNull().defaultNow(),
    tanggalAkhirSimpanan: date("tanggal_akhir_simpanan").notNull().defaultNow(),
    tanggalPembagian: date("tanggal_pembagian").notNull().defaultNow(),
    basilSimpanan: numeric("basil_simpanan", { precision: 5, scale: 2 }),
    statusPendaftaranSimpanan: statusPendaftaranSimpananEnum(
      "status_pendaftaran_simpanan"
    )
      .notNull()
      .default("OPEN"),
    createdAt: date("created_at").notNull().defaultNow(),
    updatedAt: date("updated_at").notNull().defaultNow(),
  }
);

//PENDAFTAR SIMPANAN BERJANGKA
export const pendaftaranSimpananTable = pgTable("pendaftaran_simpanan", {
  idPendaftar: uuid("id_pendaftar").primaryKey().defaultRandom(),
  noAnggota: varchar("no_anggota", { length: 10 })
    .notNull()
    .references(() => anggotaTable.noAnggota, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  settingPendaftaranId: uuid("setting_pendaftaran_id")
    .notNull()
    .references(() => settingPendaftaranSimpananTable.idSettingPendaftaran, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  tanggalPendaftaran: date("tanggal_pendaftaran").notNull().defaultNow(),
  jumlahPilihan: numeric("jumlah_pilihan").notNull(),
});

//PEMBAGIAN SIMPANAN BERJANGKA
export const detailPembagianSimpananTable = pgTable(
  "detail_pembagian_simpanan",
  {
    idDetailPembagian: uuid("id_detail_pembagian").primaryKey().defaultRandom(),
    pendaftarId: uuid("pendaftar_id")
      .notNull()
      .references(() => pendaftaranSimpananTable.idPendaftar, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    tanggalDetailPembagian: date("tanggal_detail_pembagian")
      .notNull()
      .defaultNow(),
    jumlahDetailPembagian: numeric("jumlah_detail_pilihan").notNull(),
  }
);

//PINJAMAN
export const jenisPinjamanEnum = pgEnum("jenis_pinjaman", [
  "PRODUKTIF",
  "BARANG",
]);

export const statusPinjamanEnum = pgEnum("status_pinjaman", [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
]);

export const pinjamanTable = pgTable("pinjaman", {
  noPinjaman: varchar("no_pinjaman", { length: 20 }).primaryKey().notNull(),
  tujuanPinjaman: varchar("tujuan_pinjaman", { length: 255 }).notNull(),
  noAnggota: varchar("no_anggota", { length: 10 })
    .notNull()
    .references(() => anggotaTable.noAnggota, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  tanggalPinjaman: date("tanggal_pinjaman").notNull().defaultNow(),
  waktuPengembalian: integer("waktu_pinjaman").notNull(),
  jenisPinjman: jenisPinjamanEnum("jenis_pinjaman")
    .default("PRODUKTIF")
    .notNull(),
  ajuanPinjaman: numeric("ajuan_pinjaman").notNull(),
  jumlahDiterima: numeric("jumlah_diterima").notNull(),
  strukGaji: text("struk_gaji").notNull(),
  jumlahPenghasilan: numeric("jumlah_penghasilan").notNull(),
  statusPinjaman: statusPinjamanEnum("status_pinjaman")
    .default("PENDING")
    .notNull(),
});

//ANGSURAN
export const statusAngsuranEnum = pgEnum("status_angsuran", [
  "PENDING",
  "ONPROGRESS",
  "COMPLETED",
]);

export const angsuranTable = pgTable("angsuran", {
  noAngsuran: varchar("no_angsuran", { length: 20 }).primaryKey().notNull(),
  tanggalAngsuran: date("tanggal_angsuran").notNull().defaultNow(),
  pinjamanId: varchar("pinjaman_id", { length: 20 })
    .notNull()
    .references(() => pinjamanTable.noPinjaman, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  angsuranPinjamanKe: integer("angsuran_pinjaman_ke").notNull(),
  angsuranPinjamanDari: integer("angsuran_pinjaman_dari").notNull(),
  jumlahAngsuran: numeric("jumlah_angsuran").notNull(),
  statusAngsuran: statusAngsuranEnum("status_angsuran")
    .default("PENDING")
    .notNull(),
});

//PELUNASAN PINJAMAN
export const jenisPelunasanPinjamanEnum = pgEnum("jenis_pelunasan_pinjaman", [
  "CASH",
  "TRANSFER",
]);

export const statusPelunasanPinjamanEnum = pgEnum("status_pelunasan_pinjaman", [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
]);

export const pelunasanPinjamanTable = pgTable("pelunasan_pinjaman", {
  noPelunasanPinjaman: varchar("no_pelunasan_pinjaman", { length: 20 })
    .primaryKey()
    .notNull(),
  tanggalPelunasanPinjaman: date("tanggal_pelunasan_pinjaman")
    .notNull()
    .defaultNow(),
  pinjamanId: varchar("pinjaman_id", { length: 20 })
    .notNull()
    .references(() => pinjamanTable.noPinjaman, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  jenisPelunasanPinjaman: jenisPelunasanPinjamanEnum("jenis_pelunasan_pinjaman")
    .default("TRANSFER")
    .notNull(),
  angsuranKePelunasanPinjaman: integer("angsuran_ke_pelunasan").notNull(),
  sudahDibayarkan: numeric("sudah_dibayarkan").notNull(),
  jumlahPelunasanPinjaman: numeric("jumlah_pelunasan_pinjaman").notNull(),
  buktiPelunasan: text("bukti_pelunasan").notNull(),
  statusPelunasanPinjaman: statusPelunasanPinjamanEnum(
    "status_pelunasan_pinjaman"
  )
    .default("PENDING")
    .notNull(),
});

//ASURANSI
export const asuransiTable = pgTable("asuransi", {
  noAsuransi: varchar("no_asuransi", { length: 20 }).primaryKey().notNull(),
  pinjamanId: varchar("pinjaman_id", { length: 20 })
    .notNull()
    .references(() => pinjamanTable.noPinjaman, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  usiaAsuransi: integer("usia_asuransi").notNull(),
  tanggalAsuransi: date("tanggal_asuransi").notNull().defaultNow(),
  tanggalAkhirAsuransi: date("tanggal_akhir_asuransi").notNull().defaultNow(),
  masaAsuransiTH: integer("masa_asuransi_th").notNull(),
  masaAsuransiBL: integer("masa_asuransi_bl").notNull(),
  masaAsuransiJK: integer("masa_asuransi_jk").notNull(),
  premi: integer("premi").notNull(),
});

//POTONG GAJI
export const potongGajiTable = pgTable("potong_gaji", {
  idPotongGaji: uuid("id_potong_gaji").primaryKey().defaultRandom(),
  tanggalPotongGaji: date("tanggal_potong_gaji").notNull().defaultNow(),
  noAnggota: varchar("no_anggota", { length: 10 })
    .notNull()
    .references(() => anggotaTable.noAnggota, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  simpananWajib: integer("simpanan_wajib"),
  simpananSukamana: integer("simpanan_sukamana"),
  simpananLebaran: integer("simpanan_lebaran"),
  simpananQurban: integer("simpanan_qurban"),
  simpananUbar: integer("simpanan_ubar"),
  noPinjamanProduktif: varchar("no_pinjaman_produktif", { length: 20 }),
  angsuranKeProduktif: integer("angsuran_ke_produktif"),
  angsuranDariProduktif: integer("angsuran_dari_produktif"),
  jumlahAngsuranProduktif: numeric("jumlah_angsuran_produktif"),
  noPinjamanBarang: varchar("no_pinjaman_barang", { length: 20 }),
  angsuranKeBarang: integer("angsuran_ke_barang"),
  angsuranDariBarang: integer("angsuran_dari_barang"),
  jumlahAngsuranBarang: numeric("jumlah_angsuran_barang"),
  totalPotonganGaji: numeric("total_potongan_gaji"),
});

//PENGUNDURAN DIRI
export const statusPengunduranDiriEnum = pgEnum("status_pengunduran_diri", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const pengunduranDiriTable = pgTable("pengunduran_diri", {
  noPengunduranDiri: varchar("no_pengunduran_diri", { length: 20 })
    .primaryKey()
    .notNull(),
  tanggalPengunduranDiri: date("tanggal_pengunduran_diri")
    .notNull()
    .defaultNow(),
  noAnggota: varchar("no_anggota", { length: 10 })
    .notNull()
    .references(() => anggotaTable.noAnggota, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  keterangan: varchar("keterangan", { length: 255 }).notNull(),
  jumlahSimpananBersih: numeric("jumlah_simpanan_bersih").notNull(),
  jumlahSimpananDiterima: numeric("jumlah_simpanan_diterima").notNull(),
  statusPengunduranDiri: statusPengunduranDiriEnum("status_pengunduran_diri")
    .default("PENDING")
    .notNull(),
});

export const simpananPengunduranDiriTable = pgTable(
  "simpanan_pengunduran_diri",
  {
    idSimpananPengunduranDiri: uuid("id_simpanan_pengunduran_diri")
      .primaryKey()
      .defaultRandom(),
    noPengunduranDiri: varchar("no_pengunduran_diri", { length: 20 })
      .notNull()
      .references(() => pengunduranDiriTable.noPengunduranDiri, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    tanggalSimpananPengunduranDiri: date("tanggal_simpanan_pengunduran_diri")
      .notNull()
      .defaultNow(),
    jenisSimpananPengunduran: jenisSimpananEnum(
      "jenis_simpanan_pengunduran_diri"
    )
      .default("WAJIB")
      .notNull(),
    jumlahSimpananPengunduran: numeric(
      "jumlah_simpanan_pengunduran_diri"
    ).notNull(),
  }
);

export const pinjamanPengunduranDiriTable = pgTable(
  "pinjaman_pengunduran_diri",
  {
    idPinjamanPengunduranDiri: uuid("id_pinjaman_pengunduran_diri")
      .primaryKey()
      .defaultRandom(),
    noPengunduranDiri: varchar("no_pengunduran_diri", { length: 20 })
      .notNull()
      .references(() => pengunduranDiriTable.noPengunduranDiri, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    pinjamanId: varchar("pinjaman_id", { length: 20 })
      .notNull()
      .references(() => pinjamanTable.noPinjaman, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    tanggalPinjamanPengunduranDiri: date("tanggal_pinjaman_pengunduran_diri")
      .notNull()
      .defaultNow(),
    jenisPinjmanPengunduranDiri: jenisPinjamanEnum(
      "jenis_pinjaman_pengunduran_diri"
    )
      .default("PRODUKTIF")
      .notNull(),
    angsuranKe: integer("angsuran_pinjaman_pengunduran_diri_ke").notNull(),
    angsuranDari: integer("angsuran_pinjaman_pengunduran_diri_dari").notNull(),
    jumlahSudahBayar: numeric("jumlah_sudah_bayar").notNull(),
    jumlahPelunasan: numeric("jumlah_pelunasan").notNull(),
  }
);

//MASTER
export const jenisKelaminMasterEnum = pgEnum("jenis_kelamin_master", [
  "PRIA",
  "WANITA",
]);

export const statusPekerjaanMasterEnum = pgEnum("status_pekerjaan_master", [
  "TETAP",
  "KONTRAK",
  "HONORER",
]);

export const masterTable = pgTable("master", {
  idMaster: uuid("id_master").primaryKey().defaultRandom(),
  username: varchar("username", { length: 255 }).unique(),
  nikMaster: varchar("nik_master", { length: 30 }).unique().notNull(),
  nipMaster: varchar("nip_master", { length: 30 }).unique(),
  namaMaster: varchar("nama_master", { length: 255 }).notNull(),
  tanggalLahirMaster: date("tanggal_lahir_master").notNull(),
  tempatLahirMaster: varchar("tempat_lahir_master", { length: 100 }).notNull(),
  jenisKelaminMaster: jenisKelaminMasterEnum("jenis_kelamin_master")
    .default("PRIA")
    .notNull(),
  alamatMaster: varchar("alamat_master", { length: 255 }).notNull(),
  statusPekerjaan: statusPekerjaanMasterEnum("status_pekerjaan_master")
    .default("KONTRAK")
    .notNull(),
  jabatanId: integer("jabatan_id")
    .notNull()
    .references(() => jabatanTable.noJabatan),
  unitKerjaId: integer("unit_kerja_id")
    .notNull()
    .references(() => unitKerjaTable.noUnitKerja),
});

//NOTIFICATIONS
export const statusNotificationEnum = pgEnum("status_notification", [
  "PENDING",
  "SENT",
  "FAILED",
]);

export const notificationsTable = pgTable("notifications", {
  idNotification: uuid("id_notifications").primaryKey().defaultRandom(),
  tanggalNotification: date("tanggal_notification").notNull().defaultNow(),
  noTelpNotification: varchar("telepon_notification", { length: 20 }),
  messageNotification: text("message_notification").notNull(),
  statusNotification: statusNotificationEnum("status_notification")
    .default("PENDING")
    .notNull(),
});

// RELATIONS JABATAN
export const jabatanRelations = relations(jabatanTable, ({ many }) => ({
  anggota: many(anggotaTable),
  master: many(masterTable),
}));

// RELATIONS UNIT KERJA
export const unitKerjaRelations = relations(unitKerjaTable, ({ many }) => ({
  anggota: many(anggotaTable),
  master: many(masterTable),
}));

// RELATIONS USER
export const usersRelations = relations(userTable, ({ one }) => ({
  anggota: one(anggotaTable, {
    fields: [userTable.username],
    references: [anggotaTable.username],
  }),
}));

// RELATIONS ANGGOTA
export const anggotaRelations = relations(anggotaTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [anggotaTable.username],
    references: [userTable.username],
  }),
  jabatan: one(jabatanTable, {
    fields: [anggotaTable.jabatanId],
    references: [jabatanTable.noJabatan],
  }),
  unitKerja: one(unitKerjaTable, {
    fields: [anggotaTable.unitKerjaId],
    references: [unitKerjaTable.noUnitKerja],
  }),
  simpanan: many(simpananTable),
  pengambilanSimpanan: many(pengambilanSimpananTable),
  pendaftaranSimpanan: many(pendaftaranSimpananTable),
  pinjaman: many(pinjamanTable),
  potongGaji: many(potongGajiTable),
  pengunduranDiri: many(pengunduranDiriTable),
}));

// RELATIONS SIMPANAN
export const simpananRelations = relations(simpananTable, ({ one }) => ({
  anggota: one(anggotaTable, {
    fields: [simpananTable.noAnggota],
    references: [anggotaTable.noAnggota],
  }),
}));

// RELATIONS PENGAMBILAN SIMPANAN
export const pengambilanSimpananRelations = relations(
  pengambilanSimpananTable,
  ({ one }) => ({
    anggota: one(anggotaTable, {
      fields: [pengambilanSimpananTable.noAnggota],
      references: [anggotaTable.noAnggota],
    }),
  })
);

// RELATIONS SETTING PENDAFTARAN SIMPANAN
export const settingSimpananRelations = relations(
  settingPendaftaranSimpananTable,
  ({ many }) => ({
    pendaftar: many(pendaftaranSimpananTable),
  })
);

// RELATIONS PENDAFTARAN SIMPANAN
export const pendaftaranSimpananRelations = relations(
  pendaftaranSimpananTable,
  ({ one, many }) => ({
    anggota: one(anggotaTable, {
      fields: [pendaftaranSimpananTable.noAnggota],
      references: [anggotaTable.noAnggota],
    }),
    settingPendaftaran: one(settingPendaftaranSimpananTable, {
      fields: [pendaftaranSimpananTable.settingPendaftaranId],
      references: [settingPendaftaranSimpananTable.idSettingPendaftaran],
    }),
    detailPembagianSimpanan: many(detailPembagianSimpananTable),
  })
);

// RELATIONS DETAIL PEMBAGIAN SIMPANAN
export const detailPembagianSimpananRelations = relations(
  detailPembagianSimpananTable,
  ({ one }) => ({
    pendaftar: one(pendaftaranSimpananTable, {
      fields: [detailPembagianSimpananTable.pendaftarId],
      references: [pendaftaranSimpananTable.idPendaftar],
    }),
  })
);

// RELATIONS PINJAMAN
export const pinjamanRelations = relations(pinjamanTable, ({ one, many }) => ({
  anggota: one(anggotaTable, {
    fields: [pinjamanTable.noAnggota],
    references: [anggotaTable.noAnggota],
  }),
  angsuran: many(angsuranTable),
  asuransi: many(asuransiTable),
  pelunasanPinjaman: many(pelunasanPinjamanTable),
  pinjamanPengunduranDiri: many(pinjamanPengunduranDiriTable),
}));

// RELATIONS ANGSURAN
export const angsuranRelations = relations(angsuranTable, ({ one }) => ({
  pinjaman: one(pinjamanTable, {
    fields: [angsuranTable.pinjamanId],
    references: [pinjamanTable.noPinjaman],
  }),
}));

// RELATIONS PELUNASAN PINJAMAN
export const pelunasanPinjamanRelations = relations(
  pelunasanPinjamanTable,
  ({ one }) => ({
    pinjaman: one(pinjamanTable, {
      fields: [pelunasanPinjamanTable.pinjamanId],
      references: [pinjamanTable.noPinjaman],
    }),
  })
);

// RELATIONS ASURANSI
export const asuransiRelations = relations(asuransiTable, ({ one }) => ({
  pinjaman: one(pinjamanTable, {
    fields: [asuransiTable.pinjamanId],
    references: [pinjamanTable.noPinjaman],
  }),
}));

// RELATIONS MASTER
export const masterRelations = relations(masterTable, ({ one }) => ({
  jabatan: one(jabatanTable, {
    fields: [masterTable.jabatanId],
    references: [jabatanTable.noJabatan],
  }),
  unitKerja: one(unitKerjaTable, {
    fields: [masterTable.unitKerjaId],
    references: [unitKerjaTable.noUnitKerja],
  }),
}));

// RELATIONS POTONG GAJI
export const potongGajiRelations = relations(potongGajiTable, ({ one }) => ({
  anggota: one(anggotaTable, {
    fields: [potongGajiTable.noAnggota],
    references: [anggotaTable.noAnggota],
  }),
}));

// RELATIONS PENGUNDURAN DIRI
export const pengunduranDiriRelations = relations(
  pengunduranDiriTable,
  ({ one, many }) => ({
    anggota: one(anggotaTable, {
      fields: [pengunduranDiriTable.noAnggota],
      references: [anggotaTable.noAnggota],
    }),
    simpananPengunduranDiri: many(simpananPengunduranDiriTable),
    pinjamanPengunduranDiri: many(pinjamanPengunduranDiriTable),
  })
);

// RELATIONS SIMPANAN PENGUNDURAN DIRI
export const simpananPengunduranDiriRelations = relations(
  simpananPengunduranDiriTable,
  ({ one }) => ({
    pengunduranDiri: one(pengunduranDiriTable, {
      fields: [simpananPengunduranDiriTable.noPengunduranDiri],
      references: [pengunduranDiriTable.noPengunduranDiri],
    }),
  })
);

// RELATIONS PINJAMAN PENGUNDURAN DIRI
export const pinjamanPengunduranDiriRelations = relations(
  pinjamanPengunduranDiriTable,
  ({ one }) => ({
    pengunduranDiri: one(pengunduranDiriTable, {
      fields: [pinjamanPengunduranDiriTable.noPengunduranDiri],
      references: [pengunduranDiriTable.noPengunduranDiri],
    }),
    pinjaman: one(pinjamanTable, {
      fields: [pinjamanPengunduranDiriTable.pinjamanId],
      references: [pinjamanTable.noPinjaman],
    }),
  })
);

"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import React from "react";
import { useReactToPrint } from "react-to-print";

interface IExportToPdf {
  children: React.ReactNode;
  docName: string;
}

export default function ExportToPdf({ children, docName }: IExportToPdf) {
  const contentRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: docName,
  });

  return (
    <div className="flex w-full items-center justify-center shadow rounded bg-white p-4 print:p-0 print:shadow-none print:bg-transparent">
      {/* Konten yang akan dicetak */}
      <div
        ref={contentRef}
        className="print-a4 mx-auto overflow-hidden bg-white"
      >
        {children}
      </div>

      {/* Tombol cetak */}
      <Button
        size="sm"
        className="no-print fixed bottom-4 right-4 rounded-md px-4 py-2 text-xs"
        onClick={handlePrint}
      >
        <Printer className="mr-2 h-4 w-4" />
        Print
      </Button>
    </div>
  );
}

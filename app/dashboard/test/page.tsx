import ExportToPdf from "@/components/export/export-to-pdf";
import TestStruk from "@/components/struk/struk-simpanan-berjangka/test-struk";
import React from "react";

export default function Test() {
  return (
    <ExportToPdf docName="test">
      <TestStruk />
    </ExportToPdf>
  );
}

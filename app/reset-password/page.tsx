import { ValidasiResetForm } from "@/components/form/auth/reset-password-form";
import React from "react";

export default function ResetPassword() {
  return (
    <div className="flex min-h-screen items-center justify-center py-4 px-4 bg-gray-300">
      <ValidasiResetForm />
    </div>
  );
}

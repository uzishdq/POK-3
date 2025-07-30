import React from "react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center ">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-green-600"></div>
        <p className="text-lg text-gray-700">Memuat, mohon tunggu...</p>
      </div>
    </div>
  );
}

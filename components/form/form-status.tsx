import { CircleAlert, CircleCheck, CircleX } from "lucide-react";
import React from "react";

type FromStatusProps = {
  status?: boolean;
  message?: string;
};

export default function FormStatus({ status, message }: FromStatusProps) {
  if (!message) return null;

  let bgColor = "";
  let icon = null;
  let textColor = "";

  switch (status) {
    case true:
      bgColor = "bg-emerald-500/15";
      icon = <CircleCheck height={30} width={30} />;
      textColor = "text-emerald-500";
      break;
    case false:
      bgColor = "bg-destructive/15";
      icon = <CircleX height={30} width={30} />;
      textColor = "text-destructive";
      break;
    default:
      bgColor = "bg-yellow-500/15";
      icon = <CircleAlert height={30} width={30} />;
      textColor = "text-yellow-500";
      break;
  }

  return (
    <div
      className={`flex items-center gap-x-2 rounded-md p-3 text-sm ${bgColor} ${textColor}`}
    >
      {icon}
      {message}
    </div>
  );
}

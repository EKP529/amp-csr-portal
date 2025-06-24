// import Link from "next/link";
"use client"

import Button from "@mui/material/Button";
import { redirect } from "next/navigation";

//component with href and text props
export default function LinkButton({
  href,
  text,
  size = "large",
  startIcon,
  endIcon,
  loading = false,
}: {
  href: string;
  text: string;
  size?: "small" | "medium" | "large";
  startIcon?: React.ReactNode | null;
  endIcon?: React.ReactNode | null;
  loading?: boolean;
}) {
  return (
    <Button
      className="m-1 bg-white/20 px-10 py-3 font-semibold text-white hover:bg-white/40"
      size={size}
      
      variant="outlined"
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={() => redirect(href)}
      loading={loading}
    >
      {text}
    </Button>
  );
}

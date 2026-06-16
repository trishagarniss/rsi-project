"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuperadminSettingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/superadmin/profile");
  }, [router]);

  return null;
}

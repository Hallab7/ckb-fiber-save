"use client";

import { Provider as CccProvider } from "@ckb-ccc/connector-react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <CccProvider name="FiberSave">{children}</CccProvider>;
}

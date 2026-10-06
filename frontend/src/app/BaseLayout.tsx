import type { ReactNode } from "react";
import { Header } from "./layout/Header";

export const BaseLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="p-4">{children}</main>
    </div>
  );
};

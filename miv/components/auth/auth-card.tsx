import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
  width?: "sm" | "md";
}

export function AuthCard({ children, className, width = "sm" }: AuthCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 dark:bg-slate-950">
      <Card
        className={cn(
          "w-full border-slate-200 bg-white py-0 shadow-[0_18px_55px_-20px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900",
          width === "sm" ? "max-w-md" : "max-w-lg",
          className,
        )}
      >
        <CardContent className="px-6 py-9 text-center sm:px-10 sm:py-11">
          {children}
        </CardContent>
      </Card>
    </main>
  );
}

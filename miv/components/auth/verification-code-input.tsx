"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

interface VerificationCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
}

const LENGTH = 6;

export function VerificationCodeInput({ value, onChange, disabled, invalid }: VerificationCodeInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: LENGTH }, (_, index) => value[index] || "");

  const setDigit = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    onChange(next.join(""));
    if (digit && index < LENGTH - 1) refs.current[index + 1]?.focus();
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3" role="group" aria-label="Six-digit verification code">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => { refs.current[index] = element; }}
          aria-label={`Verification code digit ${index + 1}`}
          aria-invalid={invalid}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          className={cn(
            "h-12 w-10 rounded-lg border border-slate-300 bg-white text-center text-xl font-semibold text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 disabled:cursor-not-allowed disabled:bg-slate-100 sm:h-14 sm:w-12",
            invalid && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          )}
          disabled={disabled}
          inputMode="numeric"
          maxLength={1}
          pattern="[0-9]*"
          value={digit}
          onChange={(event) => setDigit(index, event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !digit && index > 0) refs.current[index - 1]?.focus();
            if (event.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
            if (event.key === "ArrowRight" && index < LENGTH - 1) refs.current[index + 1]?.focus();
            if (event.key === "Home") refs.current[0]?.focus();
            if (event.key === "End") refs.current[LENGTH - 1]?.focus();
          }}
          onPaste={(event) => {
            const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
            if (!pasted) return;
            event.preventDefault();
            onChange(pasted);
            refs.current[Math.min(pasted.length, LENGTH) - 1]?.focus();
          }}
        />
      ))}
    </div>
  );
}

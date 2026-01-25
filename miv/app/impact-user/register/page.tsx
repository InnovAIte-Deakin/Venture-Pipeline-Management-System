import Link from "next/link";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ImpactUserRegisterPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="h-[70px] bg-[#0b8f86] text-white flex items-center px-10">
        {/* Logo */}
        <div className="flex items-center w-[220px]">
          <Logo />
        </div>

        {/* Nav */}
        <nav className="flex-1 flex items-center justify-center gap-10 text-[13px] font-medium">
          <NavItem label="About" />
          <NavItem label="Partner" />
          <NavItem label="Ventures" />
          <NavItem label="Reviews" />
          <NavItem label="Contact" />
        </nav>

        {/* Right */}
        <div className="w-[220px] flex items-center justify-end gap-4">
          <Link href="/impact-user/login" className="text-[11px] text-white/85 hover:text-white">
            Log in
          </Link>

          <Button
            asChild
            className="h-[34px] px-7 rounded-md bg-white text-[#0b8f86] text-[13px] font-semibold hover:bg-white/90"
          >
            <Link href="/impact-user/register">Sign Up</Link>
          </Button>
        </div>
      </header>

     {/* Background */}
<main className="relative min-h-[calc(100vh-70px)] overflow-hidden isolate">
  <div className="absolute inset-0 polygon-bg" />

  {/* Center card */}
  <div className="relative z-10 h-full flex items-center justify-center">
    <Card className="w-[360px] rounded-lg shadow-sm border border-black/5 px-10 py-10">
      <h1 className="text-center font-semibold text-[14px] text-black mb-8 leading-tight">
        Create your
        <br />
        personal account
      </h1>

      <form className="space-y-4">
        <Field label="Full Name" type="text" />
        <Field label="Email" type="email" />
        <Field label="Password" type="password" />

        <div className="pt-2 flex justify-center">
          <Button
            type="submit"
            className="h-[30px] w-[92px] rounded bg-[#0b8f86] text-white text-[11px] font-semibold hover:bg-[#0a7f77]"
          >
            Sign Up
          </Button>
        </div>
      </form>
    </Card>
  </div>
</main>
</div>
  );
}

function NavItem({ label }: { label: string }) {
  return (
    <button type="button" className="flex items-center gap-1 text-white/95 hover:text-white">
      <span>{label}</span>
      <span className="text-[10px] opacity-80 translate-y-[1px]">▼</span>
    </button>
  );
}

function Field({ label, type }: { label: string; type: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] text-black/70">{label}</Label>
      <Input
        type={type}
        className="h-[28px] rounded bg-[#dcdcdc] border-0 text-[12px] focus-visible:ring-2 focus-visible:ring-[#0b8f86]/30"
      />
    </div>
  );
}




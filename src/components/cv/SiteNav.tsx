"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Download, Menu } from "lucide-react";
import { useState } from "react";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#labs", label: "Labs" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Credentials" },
];

const PDF_HREF = "/Vadym_Alyekseyenko_CV.pdf";

function NavLinks({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className={cn("flex gap-1", className)}>
      {LINKS.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            onClick={onNavigate}
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-none items-center justify-between px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <a
          href="#top"
          className="font-heading text-sm text-foreground hover:opacity-80"
        >
          VA
        </a>
        <nav className="hidden md:block" aria-label="Primary">
          <NavLinks className="flex-row" />
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={PDF_HREF}
            download="Vadym_Alyekseyenko_CV.pdf"
            className="hidden h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted sm:inline-flex print:hidden"
          >
            <Download className="size-3.5 opacity-70" aria-hidden />
            2-Page PDF
          </a>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="md:hidden"
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle className="font-heading text-left">Menu</SheetTitle>
              </SheetHeader>
              <NavLinks
                className="mt-6 flex-col items-stretch"
                onNavigate={() => setOpen(false)}
              />
              <a
                href={PDF_HREF}
                download="Vadym_Alyekseyenko_CV.pdf"
                onClick={() => setOpen(false)}
                className="mt-6 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-secondary px-4 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                <Download className="size-4 opacity-70" aria-hidden />
                Download 2-Page PDF
              </a>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

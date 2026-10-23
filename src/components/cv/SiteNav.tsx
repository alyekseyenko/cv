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
import { Menu } from "lucide-react";
import { useState } from "react";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#other-work", label: "More" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
];

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
    <header
      className="no-print sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md"
    >
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
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex print:hidden"
            onClick={() => window.print()}
          >
            Save PDF
          </Button>
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
              <Button
                className="mt-6 w-full"
                variant="secondary"
                onClick={() => {
                  setOpen(false);
                  window.print();
                }}
              >
                Save PDF
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

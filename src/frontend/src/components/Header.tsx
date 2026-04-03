import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, BookOpen, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import type { Page } from "../App";

interface HeaderProps {
  currentPage: string;
  navigate: (page: Page) => void;
}

export default function Header({ currentPage, navigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; page: Page }[] = [
    { label: "Dashboard", page: { name: "dashboard" } },
    { label: "Explore Courses", page: { name: "courses" } },
    { label: "My Learning", page: { name: "courses" } },
    { label: "Community", page: { name: "courses" } },
  ];

  const isActive = (linkPage: Page) => linkPage.name === currentPage;

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.245 0.095 248), oklch(0.32 0.10 248))",
        boxShadow: "0 2px 20px oklch(0.18 0.08 248 / 0.4)",
      }}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-[72px] flex items-center gap-4">
        {/* Logo */}
        <button
          type="button"
          onClick={() => navigate({ name: "dashboard" })}
          className="flex items-center gap-2 shrink-0"
          data-ocid="header.link"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "oklch(0.65 0.13 192)" }}
          >
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-display font-bold text-xl tracking-tight">
            EduLearn
          </span>
        </button>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-1 ml-6 flex-1"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.label}
              onClick={() => navigate(link.page)}
              data-ocid="header.tab"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive(link.page)
                  ? "text-white bg-white/15"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Utility actions */}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="text-white/80 hover:text-white hover:bg-white/10"
            data-ocid="header.button"
          >
            <Search className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white/80 hover:text-white hover:bg-white/10 relative"
            data-ocid="header.button"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-edu-teal" />
          </Button>
          <Avatar className="w-8 h-8 cursor-pointer border-2 border-white/30">
            <AvatarFallback
              className="text-white text-xs font-semibold"
              style={{ background: "oklch(0.65 0.13 192)" }}
            >
              U
            </AvatarFallback>
          </Avatar>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white/80 hover:text-white hover:bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-ocid="header.button"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.label}
              onClick={() => {
                navigate(link.page);
                setMobileMenuOpen(false);
              }}
              data-ocid="header.tab"
              className={`px-3 py-2 rounded-md text-sm font-medium text-left transition-colors ${
                isActive(link.page)
                  ? "text-white bg-white/15"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

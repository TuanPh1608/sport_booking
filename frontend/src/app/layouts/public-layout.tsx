import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileMenu = () => setMobileOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileOpen(false);

  const navClassName = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-2 py-1 transition-colors ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
          <Link
            to="/"
            className="text-sm font-semibold tracking-wide text-primary"
            onClick={closeMobileMenu}
          >
            SQUADUP
          </Link>

          <nav className="hidden items-center gap-2 text-sm md:flex">
            <NavLink to="/" className={navClassName}>
              Home
            </NavLink>
            <NavLink to="/login" className={navClassName}>
              Đăng nhập
            </NavLink>
            <NavLink to="/dashboard" className={navClassName}>
              Dashboard
            </NavLink>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle navigation"
            onClick={toggleMobileMenu}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {mobileOpen ? (
          <div className="border-t bg-background md:hidden">
            <nav className="mx-auto flex w-full max-w-7xl flex-col px-4 py-3 text-sm">
              <NavLink
                to="/"
                className={({ isActive }) => navClassName({ isActive })}
                onClick={closeMobileMenu}
              >
                Home
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) => navClassName({ isActive })}
                onClick={closeMobileMenu}
              >
                Đăng nhập
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => navClassName({ isActive })}
                onClick={closeMobileMenu}
              >
                Dashboard
              </NavLink>
            </nav>
          </div>
        ) : null}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t bg-background">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>Football Pitch Booking Platform</span>
          <div className="flex items-center gap-3">
            <a
              href="mailto:support@squadup.vn"
              className="hover:text-foreground"
            >
              support@squadup.vn
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

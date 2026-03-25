import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth-store";

export function AppLayout() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => setMobileOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileOpen(false);

  const navClassName = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-2 py-1 transition-colors ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:text-foreground"
    }`;

  const handleLogout = () => {
    clearAuth();
    closeMobileMenu();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-semibold tracking-wide text-primary"
              onClick={closeMobileMenu}
            >
              SQUADUP
            </Link>
            <nav className="hidden items-center gap-2 text-sm md:flex">
              <NavLink to="/dashboard" className={navClassName}>
                Dashboard
              </NavLink>
              <NavLink to="/profile" className={navClassName}>
                Profile
              </NavLink>
              <NavLink to="/admin/dashboard" className={navClassName}>
                Admin
              </NavLink>
            </nav>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <div className="text-xs text-muted-foreground">
              {user?.fullName || "User"}
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>

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
            <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-3 text-sm">
              <p className="px-2 pb-2 text-xs text-muted-foreground">
                {user?.fullName || "User"}
              </p>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => navClassName({ isActive })}
                onClick={closeMobileMenu}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) => navClassName({ isActive })}
                onClick={closeMobileMenu}
              >
                Profile
              </NavLink>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) => navClassName({ isActive })}
                onClick={closeMobileMenu}
              >
                Admin
              </NavLink>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        ) : null}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t bg-background">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>Booking workspace</span>
          <div className="flex items-center gap-3">
            <span>Realtime schedule management</span>
            <a href="mailto:ops@squadup.vn" className="hover:text-foreground">
              ops@squadup.vn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

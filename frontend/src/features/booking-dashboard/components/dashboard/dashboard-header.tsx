import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  HealthResponse,
  SessionUser,
} from "@/features/booking-dashboard/types";

interface DashboardHeaderProps {
  health: HealthResponse | null;
  loadingHealth: boolean;
  user: SessionUser;
  onHealthCheck: () => Promise<void>;
  onLogout: () => void;
}

export function DashboardHeader({
  health,
  loadingHealth,
  user,
  onHealthCheck,
  onLogout,
}: DashboardHeaderProps) {
  const navigate = useNavigate();

  return (
    <section className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-lg flex flex-wrap justify-between items-center gap-4">
      <div>
        <p className="text-xs font-semibold tracking-widest text-emerald-100">
          SQUADUP PITCH BOOKING
        </p>
        <h1 className="mt-1 text-3xl font-bold">Dashboard Đặt sân</h1>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm text-primary-foreground/90">
            {user.fullName}
          </span>
          <Badge
            variant="outline"
            className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20"
          >
            {user.role}
          </Badge>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={onHealthCheck}
          disabled={loadingHealth}
        >
          {loadingHealth
            ? "Checking..."
            : `Server: ${health?.status || "Unknown"}`}
        </Button>
        <Button
          variant="outline"
          className="bg-transparent text-primary-foreground"
          onClick={() => navigate("/")}
        >
          Trang chủ
        </Button>
        <Button variant="destructive" onClick={onLogout}>
          Đăng xuất
        </Button>
      </div>
    </section>
  );
}

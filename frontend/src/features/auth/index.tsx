import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useBookingDashboard } from "@/features/booking-dashboard/hooks/use-booking-dashboard";
import { LoginCard } from "@/features/auth/components/login-card";
import { RegisterCard } from "@/features/auth/components/register-card";

export function LoginPage() {
  const navigate = useNavigate();
  const { sessionUser, feedback, loading, handleRegister, handleLogin } =
    useBookingDashboard();

  useEffect(() => {
    if (sessionUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, sessionUser]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <section className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-lg flex flex-wrap justify-between items-center gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-emerald-100">
            SQUADUP PITCH BOOKING
          </p>
          <h1 className="mt-1 text-3xl font-bold">Đăng nhập / Đăng ký</h1>
          <p className="mt-2 text-sm text-primary-foreground/90">
            Truy cập hệ thống để đặt sân và quản lý lịch của bạn.
          </p>
        </div>
        <ButtonLink />
      </section>

      {feedback.message ? (
        <div
          className={`p-4 rounded-xl border font-medium ${
            feedback.type === "error"
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
        <RegisterCard loading={loading.register} onRegister={handleRegister} />
        <LoginCard loading={loading.login} onLogin={handleLogin} />
      </section>
    </main>
  );
}

function ButtonLink() {
  return (
    <Link
      to="/"
      className="inline-flex h-10 items-center justify-center rounded-md border border-primary-foreground/30 bg-primary-foreground/10 px-4 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/20"
    >
      Về trang chủ
    </Link>
  );
}

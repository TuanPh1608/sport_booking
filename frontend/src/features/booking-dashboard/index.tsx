import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { BookingFormCard } from "@/features/booking-dashboard/components/dashboard/booking-form-card";
import { BookingsHistoryCard } from "@/features/booking-dashboard/components/dashboard/bookings-history-card";
import { DashboardHeader } from "@/features/booking-dashboard/components/dashboard/dashboard-header";
import { useBookingDashboard } from "@/features/booking-dashboard/hooks/use-booking-dashboard";

export function BookingDashboardPage() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const {
    health,
    pitches,
    userBookings,
    sessionUser,
    feedback,
    loading,
    summary,
    fetchHealth,
    fetchPitches,
    handleCreateBooking,
    loadUserBookings,
    updateBookingStatus,
  } = useBookingDashboard();

  useEffect(() => {
    if (!sessionUser) {
      return;
    }

    void fetchPitches();
    void loadUserBookings(String(sessionUser.userId));
  }, [sessionUser]);

  if (!sessionUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-8 bg-slate-50/50">
      <DashboardHeader
        health={health}
        loadingHealth={loading.health}
        user={sessionUser}
        onHealthCheck={fetchHealth}
        onLogout={clearAuth}
      />

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex flex-col gap-6 lg:col-span-1">
          <Card className="shadow-sm bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Thẻ Thành Viên</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-xl">{sessionUser.fullName}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Hạng: {sessionUser.role}
              </p>
              <div className="mt-4 flex gap-2 text-sm font-medium">
                <Badge
                  variant="outline"
                  className="bg-emerald-100/50 text-emerald-700"
                >
                  Thành công: {summary.confirmed}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-rose-100/50 text-rose-700"
                >
                  Đã hủy: {summary.cancelled}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <BookingFormCard
            userId={sessionUser.userId}
            pitches={pitches}
            loading={loading.createBooking}
            onSubmitBooking={handleCreateBooking}
          />
        </div>

        <div className="lg:col-span-2">
          <BookingsHistoryCard
            userId={sessionUser.userId}
            bookings={userBookings}
            loading={loading.loadBookings}
            onReload={loadUserBookings}
            onUpdate={updateBookingStatus}
          />
        </div>
      </div>
    </main>
  );
}

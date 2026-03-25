import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Booking } from "@/features/booking-dashboard/types";

function statusBadgeClass(status: string): string {
  if (status === "AVAILABLE" || status === "CONFIRMED") {
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  }

  if (status === "PENDING") {
    return "bg-amber-100 text-amber-700 border-amber-200";
  }

  return "bg-rose-100 text-rose-700 border-rose-200";
}

interface BookingsHistoryCardProps {
  userId: number;
  bookings: Booking[];
  loading: boolean;
  onReload: (userId: string) => Promise<void>;
  onUpdate: (bookingId: number, action: "confirm" | "cancel") => Promise<void>;
}

export function BookingsHistoryCard({
  userId,
  bookings,
  loading,
  onReload,
  onUpdate,
}: BookingsHistoryCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Lịch sử của bạn</CardTitle>
          <CardDescription>Quản lý các lượt đặt sân</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onReload(String(userId))}
          disabled={loading}
        >
          Làm mới
        </Button>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
            Bạn chưa có lịch đặt sân nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {bookings.map((booking) => (
              <article
                key={booking.id}
                className="rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-lg text-primary">
                    Sân #{booking.pitchId}
                  </span>
                  <Badge className={statusBadgeClass(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>

                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                  <p>
                    Bắt đầu:{" "}
                    <span className="font-medium text-foreground">
                      {new Date(booking.startTime).toLocaleString("vi-VN")}
                    </span>
                  </p>
                  <p>
                    Kết thúc:{" "}
                    <span className="font-medium text-foreground">
                      {new Date(booking.endTime).toLocaleString("vi-VN")}
                    </span>
                  </p>
                </div>

                {booking.status === "PENDING" && (
                  <div className="flex gap-2 pt-3 border-t">
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => onUpdate(booking.id, "confirm")}
                    >
                      Chốt ngay
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => onUpdate(booking.id, "cancel")}
                    >
                      Hủy
                    </Button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

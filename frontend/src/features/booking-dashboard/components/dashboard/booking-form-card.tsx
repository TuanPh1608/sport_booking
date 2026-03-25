import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  CreateBookingPayload,
  Pitch,
} from "@/features/booking-dashboard/types";

const bookingSchema = z
  .object({
    userId: z.string().min(1, "Bắt buộc nhập userId"),
    pitchId: z.string().min(1, "Bắt buộc chọn sân"),
    startTime: z.string().min(1, "Bắt buộc chọn giờ bắt đầu"),
    endTime: z.string().min(1, "Bắt buộc chọn giờ kết thúc"),
  })
  .refine((value) => new Date(value.endTime) > new Date(value.startTime), {
    message: "Thời gian kết thúc phải lớn hơn thời gian bắt đầu",
    path: ["endTime"],
  });

interface BookingFormCardProps {
  userId: number;
  pitches: Pitch[];
  loading: boolean;
  onSubmitBooking: (payload: CreateBookingPayload) => Promise<void>;
}

export function BookingFormCard({
  userId,
  pitches,
  loading,
  onSubmitBooking,
}: BookingFormCardProps) {
  const form = useForm<{
    userId: string;
    pitchId: string;
    startTime: string;
    endTime: string;
  }>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      userId: String(userId),
      pitchId: "",
      startTime: "",
      endTime: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const payload: CreateBookingPayload = {
      userId: Number(values.userId),
      pitchId: Number(values.pitchId),
      startTime: `${values.startTime}:00`,
      endTime: `${values.endTime}:00`,
    };
    await onSubmitBooking(payload);
    form.reset({
      ...values,
      startTime: "",
      endTime: "",
    });
  });

  return (
    <Card className="shadow-md border-primary">
      <CardHeader>
        <CardTitle>Đặt Sân Mới</CardTitle>
        <CardDescription>Chọn giờ và chốt sân ngay</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            type="hidden"
            {...form.register("userId")}
            value={String(userId)}
          />

          <div className="space-y-2">
            <Label>Chọn Sân</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              {...form.register("pitchId")}
            >
              <option value="">-- Click để chọn sân --</option>
              {pitches
                .filter((p) => p.status === "AVAILABLE")
                .map((pitch) => (
                  <option key={pitch.id} value={pitch.id}>
                    {pitch.name} ({pitch.pitchType}) - {pitch.pricePerHour}đ
                  </option>
                ))}
            </select>
            <p className="text-xs text-rose-500">
              {form.formState.errors.pitchId?.message}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Giờ bắt đầu</Label>
            <Input type="datetime-local" {...form.register("startTime")} />
            <p className="text-xs text-rose-500">
              {form.formState.errors.startTime?.message}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Giờ kết thúc</Label>
            <Input type="datetime-local" {...form.register("endTime")} />
            <p className="text-xs text-rose-500">
              {form.formState.errors.endTime?.message}
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full shadow-lg">
            {loading ? "Đang khóa sân..." : "Xác nhận Đặt"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

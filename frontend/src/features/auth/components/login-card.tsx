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
import type { LoginPayload } from "@/features/booking-dashboard/types";

const loginSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số"),
  password: z.string().min(8, "Mật khẩu phải từ 8 ký tự"),
});

interface LoginCardProps {
  loading: boolean;
  onLogin: (payload: LoginPayload) => Promise<void>;
}

export function LoginCard({ loading, onLogin }: LoginCardProps) {
  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phoneNumber: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await onLogin(values);
  });

  return (
    <Card className="shadow-md border-primary/20">
      <CardHeader>
        <CardTitle>Đăng nhập</CardTitle>
        <CardDescription>Chào mừng bạn quay lại</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Số điện thoại</Label>
            <Input {...form.register("phoneNumber")} placeholder="09xxxx" />
            <p className="text-xs text-rose-500">
              {form.formState.errors.phoneNumber?.message}
            </p>
          </div>
          <div className="space-y-2">
            <Label>Mật khẩu</Label>
            <Input type="password" {...form.register("password")} />
            <p className="text-xs text-rose-500">
              {form.formState.errors.password?.message}
            </p>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {loading ? "Đang vào..." : "Đăng nhập ngay"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

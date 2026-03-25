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
import type { RegisterPayload } from "@/features/booking-dashboard/types";

const registerSchema = z.object({
  fullName: z.string().min(2, "Họ tên tối thiểu 2 ký tự"),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số"),
  password: z.string().min(8, "Mật khẩu phải từ 8 ký tự"),
  role: z.enum(["CUSTOMER", "ADMIN"]),
});

interface RegisterCardProps {
  loading: boolean;
  onRegister: (payload: RegisterPayload) => Promise<void>;
}

export function RegisterCard({ loading, onRegister }: RegisterCardProps) {
  const form = useForm<RegisterPayload>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      password: "",
      role: "CUSTOMER",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await onRegister(values);
    form.reset({
      fullName: "",
      phoneNumber: "",
      password: "",
      role: "CUSTOMER",
    });
  });

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Khách hàng mới?</CardTitle>
        <CardDescription>Tạo tài khoản để bắt đầu đặt sân</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Họ và tên</Label>
            <Input
              {...form.register("fullName")}
              placeholder="Nhập họ tên của bạn"
            />
            <p className="text-xs text-rose-500">
              {form.formState.errors.fullName?.message}
            </p>
          </div>
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
          <Input type="hidden" {...form.register("role")} value="CUSTOMER" />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Đang xử lý..." : "Đăng ký tài khoản"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

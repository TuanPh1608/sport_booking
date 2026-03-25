import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function HomeHero() {
  return (
    <section className="rounded-2xl bg-primary p-8 text-primary-foreground shadow-lg">
      <p className="text-xs font-semibold tracking-widest text-emerald-100">
        SQUADUP PITCH BOOKING
      </p>
      <h1 className="mt-2 text-4xl font-bold leading-tight">
        Đặt sân bóng online nhanh, rõ lịch, không trùng ca
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-primary-foreground/90">
        Nền tảng giúp khách hàng xem sân khả dụng theo thời gian thực và giúp
        chủ sân quản lý lịch đặt chính xác với backend Spring Boot.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild size="lg" variant="secondary">
          <Link to="/login">Đăng nhập để đặt sân</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="bg-transparent text-primary-foreground"
        >
          <Link to="/dashboard">Vào Dashboard</Link>
        </Button>
      </div>
    </section>
  );
}

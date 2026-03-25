import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Chặn trùng lịch theo thời gian",
    description:
      "Backend kiểm tra overlap theo khung giờ, tránh overbooking và xử lý đồng thời.",
  },
  {
    title: "Luồng xác thực JWT thật",
    description:
      "Đăng nhập nhận token thật, frontend tự gắn Bearer token vào request.",
  },
  {
    title: "Quản lý booking trực quan",
    description:
      "Theo dõi trạng thái PENDING, CONFIRMED, CANCELLED ngay trên dashboard.",
  },
];

export function HomeFeatures() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {features.map((item) => (
        <Card key={item.title}>
          <CardHeader>
            <CardTitle className="text-lg">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

import { Suspense, lazy } from "react";
import type { ReactNode } from "react";

import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { AppLayout } from "@/app/layouts/app-layout";
import { PublicLayout } from "@/app/layouts/public-layout";
import { RouteLoading } from "@/app/layouts/route-loading";
import { useAuthStore } from "@/features/auth/store/auth-store";

const HomePage = lazy(async () => {
  const module = await import("@/features/home");
  return { default: module.HomePage };
});

const LoginPage = lazy(async () => {
  const module = await import("@/features/auth");
  return { default: module.LoginPage };
});

const BookingDashboardPage = lazy(async () => {
  const module = await import("@/features/booking-dashboard");
  return { default: module.BookingDashboardPage };
});

function PrivateRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AdminRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}

function RoutePlaceholder({ title }: { title: string }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-10">
      <div className="rounded-xl border bg-card p-8 text-center">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Route đã sẵn sàng để tách thành feature riêng.
        </p>
      </div>
    </main>
  );
}

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteLoading />}>{children}</Suspense>;
}

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: (
          <LazyPage>
            <HomePage />
          </LazyPage>
        ),
      },
      {
        path: "/login",
        element: (
          <LazyPage>
            <LoginPage />
          </LazyPage>
        ),
      },
      {
        path: "/pitches/:id",
        element: <RoutePlaceholder title="Chi tiết sân" />,
      },
    ],
  },
  {
    element: (
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: (
          <LazyPage>
            <BookingDashboardPage />
          </LazyPage>
        ),
      },
      {
        path: "/profile",
        element: <RoutePlaceholder title="Profile" />,
      },
      {
        path: "/admin/dashboard",
        element: (
          <AdminRoute>
            <RoutePlaceholder title="Admin Dashboard" />
          </AdminRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

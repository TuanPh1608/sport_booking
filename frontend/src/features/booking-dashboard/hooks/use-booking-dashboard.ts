import { useMemo, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/features/auth/store/auth-store";
import {
  createBooking,
  getErrorMessage,
  getHealth,
  getPitches,
  getUserBookings,
  loginUser,
  registerUser,
  updateBookingStatus,
} from "@/features/booking-dashboard/api";
import type {
  Booking,
  CreateBookingPayload,
  FeedbackState,
  LoginPayload,
  RegisterPayload,
} from "@/features/booking-dashboard/types";

export function useBookingDashboard() {
  const queryClient = useQueryClient();
  const [bookingListUserId, setBookingListUserId] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>({
    type: "info",
    message: "",
  });

  const sessionUser = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);

  const healthQuery = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    enabled: false,
  });

  const pitchesQuery = useQuery({
    queryKey: ["pitches"],
    queryFn: getPitches,
    enabled: false,
  });

  const userBookingsQuery = useQuery({
    queryKey: ["userBookings", bookingListUserId],
    queryFn: () => getUserBookings(bookingListUserId),
    enabled: Boolean(bookingListUserId),
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => registerUser(payload),
    onSuccess: () => {
      setFeedback({
        type: "success",
        message: "Đăng ký thành công. Bạn có thể đăng nhập ngay.",
      });
    },
    onError: (error) => {
      setFeedback({
        type: "error",
        message: `Đăng ký thất bại: ${getErrorMessage(error)}`,
      });
    },
  });

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => loginUser(payload),
    onSuccess: (data) => {
      setAuth(data.token, {
        userId: data.userId,
        fullName: data.fullName,
        role: data.role,
      });
      setBookingListUserId(String(data.userId));
      setFeedback({
        type: "success",
        message: `Xin chào ${data.fullName}, đăng nhập thành công.`,
      });
    },
    onError: (error) => {
      setFeedback({
        type: "error",
        message: `Đăng nhập thất bại: ${getErrorMessage(error)}`,
      });
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: (payload: CreateBookingPayload) => createBooking(payload),
    onSuccess: async () => {
      setFeedback({
        type: "success",
        message: "Đặt sân thành công. Vui lòng xác nhận hoặc hủy nếu cần.",
      });
      if (bookingListUserId) {
        await queryClient.invalidateQueries({
          queryKey: ["userBookings", bookingListUserId],
        });
      }
    },
    onError: (error) => {
      setFeedback({
        type: "error",
        message: `Tạo booking thất bại: ${getErrorMessage(error)}`,
      });
    },
  });

  const updateBookingMutation = useMutation({
    mutationFn: ({
      bookingId,
      action,
    }: {
      bookingId: number;
      action: "confirm" | "cancel";
    }) => updateBookingStatus(bookingId, action),
    onSuccess: async (_, variables) => {
      setFeedback({
        type: "success",
        message: `Booking #${variables.bookingId} đã ${variables.action === "confirm" ? "xác nhận" : "hủy"}.`,
      });

      if (bookingListUserId) {
        await queryClient.invalidateQueries({
          queryKey: ["userBookings", bookingListUserId],
        });
      }
    },
    onError: (error) => {
      setFeedback({
        type: "error",
        message: `Cập nhật booking thất bại: ${getErrorMessage(error)}`,
      });
    },
  });

  const summary = useMemo(() => {
    const bookings: Booking[] = userBookingsQuery.data || [];
    const confirmed = bookings.filter(
      (item) => item.status === "CONFIRMED",
    ).length;
    const pending = bookings.filter((item) => item.status === "PENDING").length;
    const cancelled = bookings.filter(
      (item) => item.status === "CANCELLED",
    ).length;
    return { confirmed, pending, cancelled };
  }, [userBookingsQuery.data]);

  const fetchHealth = async () => {
    const result = await healthQuery.refetch();
    if (result.error) {
      setFeedback({
        type: "error",
        message: `Không gọi được health check: ${getErrorMessage(result.error)}`,
      });
      return;
    }

    setFeedback({ type: "success", message: "Kết nối backend thành công." });
  };

  const fetchPitches = async () => {
    const result = await pitchesQuery.refetch();
    if (result.error) {
      setFeedback({
        type: "error",
        message: `Không tải được danh sách sân: ${getErrorMessage(result.error)}`,
      });
      return;
    }

    setFeedback({ type: "success", message: "Đã tải danh sách sân." });
  };

  const handleRegister = async (payload: RegisterPayload) => {
    await registerMutation.mutateAsync(payload);
  };

  const handleLogin = async (payload: LoginPayload) => {
    await loginMutation.mutateAsync(payload);
  };

  const handleCreateBooking = async (payload: CreateBookingPayload) => {
    await createBookingMutation.mutateAsync(payload);
  };

  const loadUserBookings = async (userId: string) => {
    setBookingListUserId(userId);
    try {
      await queryClient.fetchQuery({
        queryKey: ["userBookings", userId],
        queryFn: () => getUserBookings(userId),
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: `Không tải được lịch sử booking: ${getErrorMessage(error)}`,
      });
      return;
    }

    setFeedback({ type: "success", message: "Đã tải lịch sử booking." });
  };

  const updateBookingStatus = async (
    bookingId: number,
    action: "confirm" | "cancel",
  ) => {
    await updateBookingMutation.mutateAsync({ bookingId, action });
  };

  const loading = {
    health: healthQuery.isFetching,
    pitches: pitchesQuery.isFetching,
    register: registerMutation.isPending,
    login: loginMutation.isPending,
    createBooking: createBookingMutation.isPending,
    loadBookings: userBookingsQuery.isFetching,
  };

  return {
    health: healthQuery.data || null,
    pitches: pitchesQuery.data || [],
    bookingListUserId,
    userBookings: userBookingsQuery.data || [],
    sessionUser,
    feedback,
    loading,
    summary,
    setBookingListUserId,
    fetchHealth,
    fetchPitches,
    handleRegister,
    handleLogin,
    handleCreateBooking,
    loadUserBookings,
    updateBookingStatus,
  };
}

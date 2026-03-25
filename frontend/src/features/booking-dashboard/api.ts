import axios from "axios";

import { http } from "@/lib/http";

import type {
  CreateBookingPayload,
  LoginResponse,
  LoginPayload,
  Pitch,
  RegisterPayload,
} from "@/features/booking-dashboard/types";

interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
}

interface BookingListResponse {
  bookings: Array<{
    id: number;
    userId: number;
    pitchId: number;
    startTime: string;
    endTime: string;
    totalPrice: number | string;
    status: string;
  }>;
}

interface PitchesResponse {
  pitches: Pitch[];
}

export async function getHealth() {
  const { data } = await http.get<HealthResponse>("/api/health");
  return data;
}

export async function getPitches() {
  const { data } = await http.get<PitchesResponse>("/api/pitches");
  return data.pitches || [];
}

export async function registerUser(payload: RegisterPayload) {
  const { data } = await http.post("/api/users/register", payload);
  return data;
}

export async function loginUser(payload: LoginPayload) {
  const { data } = await http.post<LoginResponse>("/api/users/login", payload);
  return data;
}

export async function createBooking(payload: CreateBookingPayload) {
  const { data } = await http.post("/api/bookings", payload);
  return data;
}

export async function getUserBookings(userId: string) {
  const { data } = await http.get<BookingListResponse>(
    `/api/bookings/user/${userId}`,
  );
  return data.bookings || [];
}

export async function updateBookingStatus(
  bookingId: number,
  action: "confirm" | "cancel",
) {
  const { data } = await http.post(`/api/bookings/${bookingId}/${action}`);
  return data;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { error?: string; message?: string } | undefined)
        ?.error ||
      (error.response?.data as { error?: string; message?: string } | undefined)
        ?.message ||
      error.message
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Đã có lỗi không xác định.";
}

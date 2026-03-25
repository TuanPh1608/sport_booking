export type FeedbackType = "info" | "success" | "error";

export interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
}

export interface Pitch {
  id: number;
  name: string;
  pitchType: string;
  pricePerHour: number | string;
  status: string;
}

export interface Booking {
  id: number;
  userId: number;
  pitchId: number;
  startTime: string;
  endTime: string;
  totalPrice: number | string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | string;
}

export interface SessionUser {
  userId: number;
  fullName: string;
  role: string;
}

export interface LoginResponse extends SessionUser {
  token: string;
  message: string;
}

export interface RegisterPayload {
  fullName: string;
  phoneNumber: string;
  password: string;
  role: "CUSTOMER" | "ADMIN";
}

export interface LoginPayload {
  phoneNumber: string;
  password: string;
}

export interface CreateBookingPayload {
  userId: number;
  pitchId: number;
  startTime: string;
  endTime: string;
}

export interface RegisterForm {
  fullName: string;
  phoneNumber: string;
  password: string;
  role: "CUSTOMER" | "ADMIN";
}

export interface LoginForm {
  phoneNumber: string;
  password: string;
}

export interface BookingForm {
  userId: string;
  pitchId: string;
  startTime: string;
  endTime: string;
}

export interface FeedbackState {
  type: FeedbackType;
  message: string;
}

export interface LoadingState {
  health: boolean;
  pitches: boolean;
  register: boolean;
  login: boolean;
  createBooking: boolean;
  loadBookings: boolean;
}

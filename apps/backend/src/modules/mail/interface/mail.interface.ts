export interface IMailPayload {
  to: string;
  subject?: string;
  text?: string;
  html?: string;
  code?: string; // For OTP or other codes
  context?:
    | IBookingPayload
    | IBookingCancel
    | IResetPassword
    | INotifyBookingUser
    | IInquiryPayload;
}

export interface IInquiryPayload {
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  estBudget: number;
  timing: string;
}

export interface IBookingPayload {
  toEmail: string;
  fullName: string;
  bookingId: string;
  email: string;
  phone?: string;
  grandTotal: number;
  bookingDetails: IBookingDetails[];
}

export interface IBookingDetails {
  destination: string;
  tripDate: Date;
  totalUsers: number;
  totalPrice: number;
}

export interface IBookingCancel {
  fullName: string;
  bookingId: string;
  email: string;
  toEmail: string;
  phone?: string;
  grandTotal: number;
  bookingDetails: IBookingDetails[];
}

export interface INotifyBookingUser {
  fullName: string;
  bookingId: string;
  toEmail: string;
  email: string;
  phone?: string;
  grandTotal: number;
  bookingDetails: IBookingDetails[];
}

export interface IForgetPassword {
  code: string;
}

export interface IResetPassword {
  resetLink: string;
}

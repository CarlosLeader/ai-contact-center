export type CallStatus =
  | "INCOMING"
  | "IDENTIFICATION_REQUIRED"
  | "IDENTIFYING"
  | "VERIFIED"
  | "NOT_VERIFIED"
  | "IN_CONVERSATION"
  | "PROCESSING"
  | "TRANSFER_PENDING"
  | "TRANSFERRED"
  | "COMPLETED"
  | "FAILED"
  | "ABANDONED";

export type VerificationStatus =
  | "PENDING"
  | "VERIFYING"
  | "VERIFIED"
  | "ADDITIONAL_VERIFICATION"
  | "FAILED"
  | "EXPIRED";

export interface Customer {
  customerId: string;
  fullName: string;
  personalId: string;
  phone: string;
  requestId: string;
  requestStatus: string;
  estimatedResolution: string;
}

export interface Request {
  requestId: string;
  customerId: string;
  requestType: string;
  status: string;
  estimatedResolution: string;
}

export interface Ticket {
  ticketId: string;
  title: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  shift: string;
  status: "ONLINE" | "BUSY" | "OFFLINE";
}

export interface Call {
  callId: string;
  callerId: string;
  customerName: string;
  customerId: string;
  status: CallStatus;
  verificationStatus: VerificationStatus;
  duration: string;
  intent: string;
  requestId: string;
}

export interface CallEvent {
  timestamp: string;
  event: string;
  reference?: string;
}

export interface KpiMetric {
  title: string;
  value: string;
  icon: string;
}

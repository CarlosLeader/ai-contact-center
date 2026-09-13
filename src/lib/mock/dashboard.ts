import {
  Activity,
  ArrowRightLeft,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  ClipboardList,
  Clock3,
  FileText,
  History,
  LayoutGrid,
  PhoneCall,
  Radio,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type {
  Agent,
  Call,
  CallEvent,
  Customer,
  KpiMetric,
  Request,
  Ticket,
} from "@/types";

export const customerDemo: Customer = {
  customerId: "CLI-10245",
  fullName: "Carlos Gómez",
  personalId: "00112345678",
  phone: "+1 809 555 1234",
  requestId: "REQ-98421",
  requestStatus: "En proceso",
  estimatedResolution: "15/09/2026",
};

export const demoRequests: Request[] = [
  {
    requestId: "REQ-98421",
    customerId: "CLI-10245",
    requestType: "Consulta de solicitud",
    status: "En proceso",
    estimatedResolution: "15/09/2026",
  },
];

export const demoCalls: Call[] = [
  {
    callId: "CALL-000124",
    callerId: "+1 809 555 1234",
    customerName: "Carlos Gómez",
    customerId: "CLI-10245",
    status: "AI_LISTENING",
    verificationStatus: "VERIFIED",
    duration: "03:21",
    intent: "Consulta de solicitud",
    requestId: "REQ-98421",
  },
  {
    callId: "CALL-000125",
    callerId: "+1 809 555 5678",
    customerName: "Unknown Caller",
    customerId: "UNREGISTERED",
    status: "IDENTIFICATION_REQUIRED",
    verificationStatus: "VERIFYING",
    duration: "00:42",
    intent: "Customer identification",
    requestId: "REQ-00000",
  },
  {
    callId: "CALL-000126",
    callerId: "+1 809 555 9012",
    customerName: "María Rodríguez",
    customerId: "CLI-20480",
    status: "TRANSFERRED",
    verificationStatus: "VERIFIED",
    duration: "07:14",
    intent: "Human agent",
    requestId: "REQ-20480",
  },
];

export const recentActivity: CallEvent[] = [
  {
    id: "evt-activity-1",
    callId: "CALL-000124",
    type: "CALL_CONNECTED",
    timestamp: "10:42:18",
    metadata: { reference: "CALL-000124" },
  },
  {
    id: "evt-activity-2",
    callId: "CALL-000124",
    type: "CALLER_ID_CAPTURED",
    timestamp: "10:42:21",
    metadata: { reference: "+1 809 555 1234" },
  },
  {
    id: "evt-activity-3",
    callId: "CALL-000124",
    type: "IDENTIFICATION_REQUESTED",
    timestamp: "10:42:34",
    metadata: { reference: "CALL-000124" },
  },
  {
    id: "evt-activity-4",
    callId: "CALL-000124",
    type: "IDENTITY_VERIFIED",
    timestamp: "10:42:41",
    metadata: { reference: "CALL-000124" },
  },
  {
    id: "evt-activity-5",
    callId: "CALL-000124",
    type: "CRM_LOOKUP",
    timestamp: "10:43:02",
    metadata: { requestId: "REQ-98421" },
  },
  {
    id: "evt-activity-6",
    callId: "CALL-000124",
    type: "AI_RESPONSE",
    timestamp: "10:43:05",
  },
];

export const dashboardMetrics: KpiMetric[] = [
  { title: "Active Calls", value: "3", icon: "phone" },
  { title: "AI Resolution", value: "78%", icon: "shield" },
  { title: "Transfers", value: "12", icon: "arrow" },
  { title: "Avg. Duration", value: "04:32", icon: "clock" },
];

export const navigationItems: Array<{
  label: string;
  href: string;
  icon: LucideIcon;
}> = [
  { label: "Dashboard", href: "/", icon: LayoutGrid },
  { label: "Live Calls", href: "/live-calls", icon: Radio },
  { label: "Clientes", href: "#", icon: Users },
  { label: "Solicitudes", href: "#", icon: ClipboardList },
  { label: "Tickets", href: "#", icon: BriefcaseBusiness },
  { label: "Call History", href: "#", icon: History },
  { label: "Transcripciones", href: "#", icon: FileText },
  { label: "Agentes", href: "#", icon: ShieldCheck },
  { label: "AI Configuration", href: "#", icon: Bot },
  { label: "Knowledge Base", href: "#", icon: BookOpen },
  { label: "Audit Logs", href: "#", icon: Activity },
];

export const demoAgents: Agent[] = [
  { id: "AG-201", name: "Julia Pérez", role: "Senior Agent", shift: "09:00 - 17:00", status: "ONLINE" },
  { id: "AG-202", name: "Luis Ortega", role: "Escalations", shift: "09:00 - 17:00", status: "BUSY" },
  { id: "AG-203", name: "Ana Ramos", role: "Support", shift: "17:00 - 01:00", status: "ONLINE" },
];

export const demoTickets: Ticket[] = [
  {
    ticketId: "TCK-1001",
    customerId: "CLI-10245",
    title: "Customer verification retry",
    priority: "HIGH",
    status: "OPEN",
  },
  {
    ticketId: "TCK-1002",
    customerId: "CLI-10245",
    title: "CRM partial response",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
  },
  {
    ticketId: "TCK-1003",
    customerId: "CLI-20480",
    title: "Transfer summary review",
    priority: "LOW",
    status: "RESOLVED",
  },
];

export const moodIcons: Record<string, LucideIcon> = {
  phone: PhoneCall,
  shield: ShieldCheck,
  arrow: ArrowRightLeft,
  clock: Clock3,
};

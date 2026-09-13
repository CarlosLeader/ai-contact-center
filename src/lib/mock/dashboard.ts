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
    status: "IN_CONVERSATION",
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
  { timestamp: "10:42:18", event: "Call connected", reference: "CALL-000124" },
  {
    timestamp: "10:42:21",
    event: "Caller ID captured",
    reference: "+1 809 555 1234",
  },
  { timestamp: "10:42:34", event: "Personal ID requested", reference: "CALL-000124" },
  { timestamp: "10:42:41", event: "Customer verified", reference: "CALL-000124" },
  { timestamp: "10:43:02", event: "CRM request lookup", reference: "REQ-98421" },
  { timestamp: "10:43:05", event: "AI response generated" },
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
  { ticketId: "TCK-1001", title: "Customer verification retry", priority: "HIGH", status: "OPEN" },
  { ticketId: "TCK-1002", title: "CRM partial response", priority: "MEDIUM", status: "IN_PROGRESS" },
  { ticketId: "TCK-1003", title: "Transfer summary review", priority: "LOW", status: "RESOLVED" },
];

export const moodIcons: Record<string, LucideIcon> = {
  phone: PhoneCall,
  shield: ShieldCheck,
  arrow: ArrowRightLeft,
  clock: Clock3,
};

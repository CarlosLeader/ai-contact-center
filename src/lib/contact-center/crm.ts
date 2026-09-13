import type { Customer, Request, Ticket } from "@/types";

export const customerDemo: Customer = {
  customerId: "CLI-10245",
  fullName: "Carlos Gómez",
  personalId: "00112345678",
  phone: "+1 809 555 1234",
  requestId: "REQ-98421",
  requestStatus: "En proceso",
  estimatedResolution: "15/09/2026",
};

const mockCustomers: Customer[] = [customerDemo];

export interface CRMPort {
  findCustomerByPhone(phone: string): Customer | undefined;
  findCustomerByPersonalId(personalId: string): Customer | undefined;
  findCustomer(customerId: string): Customer | undefined;
  getRequestStatus(customerId: string, requestId: string): Request;
  createTicket(customerId: string, reason: string): Ticket;
}

export class MockCRM implements CRMPort {
  private static nextTicketSequence = 41;

  findCustomerByPhone(phone: string): Customer | undefined {
    return mockCustomers.find((customer) => customer.phone === phone);
  }

  findCustomerByPersonalId(personalId: string): Customer | undefined {
    return mockCustomers.find((customer) => customer.personalId === personalId);
  }

  findCustomer(customerId: string): Customer | undefined {
    return mockCustomers.find((customer) => customer.customerId === customerId);
  }

  getRequestStatus(customerId: string, requestId: string): Request {
    const customer = this.findCustomer(customerId);

    if (!customer) {
      return {
        requestId,
        customerId,
        requestType: "Consulta de solicitud",
        status: "En proceso",
        estimatedResolution: customerDemo.estimatedResolution,
      };
    }

    return {
      requestId: customer.requestId,
      customerId: customer.customerId,
      requestType: "Consulta de solicitud",
      status: customer.requestStatus,
      estimatedResolution: customer.estimatedResolution,
    };
  }

  createTicket(customerId: string, reason: string): Ticket {
    MockCRM.nextTicketSequence += 1;

    return {
      ticketId: `TCK-${String(MockCRM.nextTicketSequence).padStart(5, "0")}`,
      title: reason,
      priority: "MEDIUM",
      status: "OPEN",
      customerId,
    };
  }
}

export const mockCRM = new MockCRM();

export function getRequestStatus(customerId: string, requestId: string): Request {
  return mockCRM.getRequestStatus(customerId, requestId);
}

export function createTicket(customerId: string, reason: string): Ticket {
  return mockCRM.createTicket(customerId, reason);
}

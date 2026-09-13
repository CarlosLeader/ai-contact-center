import type { CRMPort } from "@/lib/contact-center/crm";
import type { Customer, VerificationStatus } from "@/types";

export function verifyCustomer(
  callerPhone: string,
  personalId: string,
  crmPort: CRMPort,
): {
  verificationStatus: VerificationStatus;
  customer?: Customer;
} {
  const customerByPhone = crmPort.findCustomerByPhone(callerPhone);
  const customerByPersonalId = crmPort.findCustomerByPersonalId(personalId);

  if (!customerByPhone && !customerByPersonalId) {
    return { verificationStatus: "FAILED" };
  }

  if (customerByPhone && customerByPersonalId && customerByPhone.customerId === customerByPersonalId.customerId) {
    return { verificationStatus: "VERIFIED", customer: customerByPhone };
  }

  if (customerByPhone || customerByPersonalId) {
    return { verificationStatus: "ADDITIONAL_VERIFICATION" };
  }

  return { verificationStatus: "FAILED" };
}

export function maskPersonalId(value: string) {
  if (!value) return "";

  if (value.length <= 4) {
    return `${value.slice(0, 2)}••••`;
  }

  return `${value.slice(0, 4)}••••${value.slice(-2)}`;
}

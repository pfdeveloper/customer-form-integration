export const validateCreateCustomerRequest = (body) => {
  const { customer } = body;

  if (!customer) return "Missing customer parameter";

  // Additional customer validation can be added here if needed
  return null; // No errors
};

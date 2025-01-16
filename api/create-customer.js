import { initializeShopifyContext, createRestClient } from "../config/shopify";
import { validateCreateCustomerRequest } from "../utils/validateRequest";
import { DataType } from "@shopify/shopify-api";

// Initialize Shopify context globally
initializeShopifyContext();

/**
 * Vercel API Handler for creating a customer in Shopify.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // Restrict in production
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Use POST." });
  }

  // Validate request body
  const validationError = validateCreateCustomerRequest(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const shop = process.env.SHOPIFY_STORE_URL;
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

  // Check environment variables
  if (!shop || !accessToken) {
    return res.status(500).json({
      error: "Server configuration error. Missing Shopify credentials.",
    });
  }

  const customer = req.body;

  try {
    // Create a Shopify REST client
    const client = createRestClient(shop, accessToken);

    // Create the customer in Shopify
    const response = await client.post({
      path: "customers",
      data: customer,
      type: DataType.JSON,
    });

    // Verify response structure
    if (!response?.body?.customer) {
      throw new Error("Invalid Shopify response format.");
    }

    // Return success response
    return res.status(201).json({
      message: "Customer created successfully.",
      customer: response.body.customer,
    });
  } catch (error) {
    console.error("Error creating customer:", error);

    // Handle errors gracefully
    const isDevelopment = process.env.NODE_ENV !== "production";
    return res.status(500).json({
      error: "Failed to create customer.",
      details: isDevelopment ? error.message : undefined,
    });
  }
}

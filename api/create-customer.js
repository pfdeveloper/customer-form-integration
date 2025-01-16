import { initializeShopifyContext, createRestClient } from "../config/shopify";
import { validateCreateCustomerRequest } from "../utils/validateRequest";
import { DataType } from "@shopify/shopify-api";

// Initialize Shopify context once
initializeShopifyContext();

/**
 * Vercel API Handler for creating a customer in Shopify.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 */
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

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

    // Return success response
    return res.status(201).json({
      message: "Customer created successfully.",
      customer: response.body.customer,
    });
  } catch (error) {
    console.error("Error creating customer:", error);

    // Handle errors gracefully
    return res.status(500).json({
      error: "Failed to create customer.",
      details: error.message,
    });
  }
}

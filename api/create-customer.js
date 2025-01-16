import { Shopify } from "@shopify/shopify-api";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { firstName, lastName, email, note } = req.body;

  // Initialize Shopify API client using the access token
  const shopify = new Shopify({
    shopDomain: process.env.SHOPIFY_STORE_URL,
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
  });

  try {
    // Create a new customer
    const response = await shopify.rest.Customer.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      note: note,
    });

    return res.status(200).json({ success: true, customer: response });
  } catch (error) {
    console.error("Error creating customer:", error);
    return res.status(500).json({ error: "Failed to create customer." });
  }
}

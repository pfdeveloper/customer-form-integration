import { Shopify } from "@shopify/shopify-api";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { firstName, lastName, email, note } = req.body;

  // Initialize Shopify API client
  const shopify = new Shopify.Clients.Rest(
    process.env.SHOPIFY_STORE_URL,
    process.env.SHOPIFY_ACCESS_TOKEN
  );

  try {
    // Create a new customer
    const response = await shopify.post({
      path: "customers",
      data: {
        customer: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          note: note,
        },
      },
      type: "application/json",
    });

    return res
      .status(200)
      .json({ success: true, customer: response.body.customer });
  } catch (error) {
    console.error(
      "Error creating customer:",
      error.response?.data || error.message
    );
    return res.status(500).json({ error: "Failed to create customer." });
  }
}

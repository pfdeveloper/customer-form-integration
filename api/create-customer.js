// api/create-customer.js

import fetch from "node-fetch";

export default async function handler(req, res) {
   // Allow CORS for all origins (you can replace '*' with a specific URL for better security)
   res.setHeader('Access-Control-Allow-Origin', 'https://development-km.myshopify.com');  // Allow all origins (for development only)
   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
 
   // Handle preflight requests (OPTIONS)
   if (req.method === 'OPTIONS') {
     return res.status(200).end(); // Respond to preflight request with 200
   }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { first_name, last_name, email, company, product } = req.body;

  // Shopify API URL and access token (retrieved from environment variables)
  const storeUrl = process.env.SHOPIFY_STORE_URL;
  const shopifyAPI = `${storeUrl}/admin/api/2023-01/customers.json`;
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN; // Access token stored securely in .env

  try {
    const response = await fetch(shopifyAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({
        customer: {
          first_name,
          last_name,
          email,
          note: `Company: ${company}`,
          tags: product,
        },
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json(data);
    } else {
      return res
        .status(500)
        .json({ message: "Error creating customer", error: data });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}

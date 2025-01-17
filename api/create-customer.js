import { shopifyApi, ApiVersion } from "@shopify/shopify-api";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-04";
import { getSessionFromStorage } from "../session"; // Session handler logic

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  apiVersion: ApiVersion.April23,
  isCustomStoreApp: true,
  adminApiAccessToken: process.env.SHOPIFY_ACCESS_TOKEN,
  isEmbeddedApp: false,
  hostName: process.env.SHOPIFY_STORE_URL,
  restResources,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { firstName, lastName, email, note } = req.body;

  try {
    const sessionId = await shopify.session.getCurrentId({
      rawRequest: req,
      rawResponse: res,
    });

    const session = await getSessionFromStorage(sessionId);

    const customer = new shopify.rest.Customer({ session });
    customer.first_name = firstName;
    customer.last_name = lastName;
    customer.email = email;
    customer.note = note;

    await customer.save({
      update: true,
    });

    return res.status(200).json({ success: true, customer: customer });
  } catch (error) {
    console.error("Error creating customer:", error);
    return res.status(500).json({ error: "Failed to create customer." });
  }
}

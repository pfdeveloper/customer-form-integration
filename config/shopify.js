import { shopifyApi, LATEST_API_VERSION } from "@shopify/shopify-api";

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: ["write_customers"],
  hostName: process.env.SHOPIFY_STORE_URL.replace(/https?:\/\//, ""),
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: false,
});

export const createRestClient = (shop, accessToken) => {
  return new shopify.clients.Rest({ shopName: shop, accessToken });
};

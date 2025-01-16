import dotenv from "dotenv";
import { shopifyApi, LATEST_API_VERSION } from "@shopify/shopify-api";

// Load environment variables from .env file
dotenv.config();

const shopify = shopifyApi({
  apiKey: "36838ce9cc099738ae13c2dc9fef14dc",
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: ["write_customers"],
  hostName: process.env.SHOPIFY_STORE_URL.replace(/https?:\/\//, ""),
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: false,
});

export const createRestClient = (shop, accessToken) => {
  return new shopify.clients.Rest({ shopName: shop, accessToken });
};

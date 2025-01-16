import { Shopify } from "@shopify/shopify-api";

export const initializeShopifyContext = () => {
  Shopify.Context.initialize({
    API_KEY: process.env.SHOPIFY_API_KEY,
    API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
    SCOPES: ["write_customers"],
    HOST_NAME: process.env.SHOPIFY_STORE_URL.replace(/https?:\/\//, ""),
    IS_EMBEDDED_APP: true,
    API_VERSION: "2023-07",
  });
};

export const createRestClient = (shop, accessToken) => {
  return new Shopify.Clients.Rest(shop, accessToken);
};

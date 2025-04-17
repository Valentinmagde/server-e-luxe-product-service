import dotenv from "dotenv";

dotenv.config();

const facebookConfig = {
  pixelId: process.env.FB_PIXEL_ID,
  catalogId: process.env.FB_CATALOG_ID,
  accessToken: process.env.FB_ACCESS_TOKEN,
  apiVersion: "v18.0",
};

export default facebookConfig

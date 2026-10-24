import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "rzp_live_TrhchmaNWAgiMV",
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "rzp_live_TrhchmaNWAgiMV",
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

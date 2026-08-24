"use client";

import React from "react";

interface AdSenseBannerProps {
  slot: string;
  format?: "horizontal" | "rectangle" | "vertical" | "auto";
  className?: string;
}

export default function AdSenseBanner({
  slot,
  format = "auto",
  className = "",
}: AdSenseBannerProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXX";
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    return (
      <div
        className={`flex items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50/50 text-gray-400 text-xs font-heading font-semibold ${
          format === "horizontal"
            ? "h-24 w-full"
            : format === "rectangle"
            ? "h-64 w-72"
            : format === "vertical"
            ? "h-96 w-40"
            : "h-24 w-full"
        } ${className}`}
      >
        <span className="opacity-50">📢 Ad Space ({format})</span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format === "auto" ? "auto" : undefined}
        data-full-width-responsive={format === "horizontal" ? "true" : undefined}
        data-tag-for-child-directed-treatment="1"
      />
    </div>
  );
}

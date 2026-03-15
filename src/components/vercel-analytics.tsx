"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

function redactSensitiveParams(event: BeforeSendEvent): BeforeSendEvent {
  if (!event.url) {
    return event;
  }

  try {
    const url = new URL(event.url, "https://flippy.local");

    if (url.pathname === "/create-new-password" && url.searchParams.has("token")) {
      url.searchParams.set("token", "redacted");
      return {
        ...event,
        url: `${url.pathname}${url.search}`,
      };
    }

    return {
      ...event,
      url: `${url.pathname}${url.search}`,
    };
  } catch {
    return event;
  }
}

export function VercelAnalytics() {
  return <Analytics beforeSend={redactSensitiveParams} />;
}

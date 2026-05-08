import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;

  if (!apiKey || !listId) {
    console.error("Mailchimp credentials not configured.");
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  // Mailchimp datacenter is the suffix after the dash in the API key (e.g. us1)
  const dc = apiKey.split("-")[1];
  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`;

  const body = JSON.stringify({
    email_address: email,
    status: "subscribed",
    tags: ["website"],
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
    },
    body,
  });

  const data = await response.json();

  if (response.status === 200 || response.status === 201) {
    return NextResponse.json({ success: true });
  }

  // Already subscribed
  if (data.title === "Member Exists") {
    return NextResponse.json({ error: "You're already subscribed." }, { status: 400 });
  }

  console.error("Mailchimp error:", data);
  return NextResponse.json({ error: "Could not subscribe. Please try again." }, { status: 500 });
}

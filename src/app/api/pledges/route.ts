import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

export interface PledgeItem {
  id: string;
  name: string;
  location: string;
  roleLabel: string;
  pledge: string;
  status: "Subscribed" | "Accomplished";
  createdAt?: string;
}

const DEFAULT_PLEDGES: PledgeItem[] = [
  {
    id: "1",
    name: "Tenzin & Pema",
    location: "New York, NY",
    roleLabel: "Individual Practitioner",
    pledge:
      "Reciting the Twenty-One Praises to Tara 1,000 times over the year for the flourishing of Tibetan language.",
    status: "Subscribed",
  },
  {
    id: "2",
    name: "Columbia & NYU Student Circle",
    location: "New York, NY",
    roleLabel: "School / University / Student Group",
    pledge:
      "Hosting an autumn lecture series and classical Tibetan calligraphy demonstration open to the university body.",
    status: "Subscribed",
  },
  {
    id: "3",
    name: "Himalayan Tea & Kitchen",
    location: "Jackson Heights, NY",
    roleLabel: "Restaurant / Business",
    pledge:
      "Displaying the celebration emblem on our front door and sponsoring the printing of 200 bilingual children's readers.",
    status: "Accomplished",
  },
  {
    id: "4",
    name: "Sarah M.",
    location: "Burlington, VT",
    roleLabel: "Individual Practitioner",
    pledge:
      "Sitting for 18 hours of dedicated silent meditation and sponsoring one young monk's annual school supplies.",
    status: "Subscribed",
  },
];

async function getPledgesFromBlob(): Promise<PledgeItem[]> {
  try {
    const { blobs } = await list({ prefix: "pledges.json" });
    const targetBlob = blobs.find((b) => b.pathname === "pledges.json");

    if (!targetBlob) {
      return DEFAULT_PLEDGES;
    }

    const res = await fetch(`${targetBlob.url}?t=${Date.now()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return DEFAULT_PLEDGES;
    }

    const data = (await res.json()) as PledgeItem[];
    return Array.isArray(data) && data.length > 0 ? data : DEFAULT_PLEDGES;
  } catch (err) {
    console.error("Error reading pledges from blob:", err);
    return DEFAULT_PLEDGES;
  }
}

export async function GET() {
  const pledges = await getPledgesFromBlob();
  return NextResponse.json(
    { pledges },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, location, roleLabel, pledge } = body ?? {};

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!pledge || typeof pledge !== "string" || !pledge.trim()) {
      return NextResponse.json(
        { error: "Pledge commitment is required" },
        { status: 400 }
      );
    }

    const currentList = await getPledgesFromBlob();

    const newEntry: PledgeItem = {
      id: String(Date.now()),
      name: name.trim(),
      location: (location && String(location).trim()) || "Global Participant",
      roleLabel: (roleLabel && String(roleLabel).trim()) || "Individual Practitioner",
      pledge: pledge.trim(),
      status: "Subscribed",
      createdAt: new Date().toISOString(),
    };

    const updatedList = [newEntry, ...currentList];

    try {
      await put("pledges.json", JSON.stringify(updatedList, null, 2), {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
      });
    } catch (putErr) {
      console.error("Error persisting pledge to Blob store:", putErr);
      // Still return the created entry to the client
    }

    return NextResponse.json(
      { success: true, entry: newEntry, pledges: updatedList },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error processing pledge submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

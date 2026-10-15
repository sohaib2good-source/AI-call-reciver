import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PROFILE_FILE = path.join(process.cwd(), "data", "business-profile.json");

export async function GET() {
  try {
    if (!fs.existsSync(PROFILE_FILE)) {
      return NextResponse.json({ success: true, data: null });
    }
    const raw = fs.readFileSync(PROFILE_FILE, "utf-8");
    const profile = JSON.parse(raw);

    return NextResponse.json({
      success: true,
      agent_context: {
        business_name: profile.businessName,
        legal_name: profile.legalName,
        description: profile.description,
        specialty: profile.specialtyValue,
        contact: {
          phone: profile.phone,
          email: profile.email,
          website: profile.website,
        },
        address: `${profile.addressStreet || ""}, ${profile.addressCity || ""}, ${profile.addressState || ""} ${profile.addressZip || ""}`.trim(),
        active_industries: profile.selectedIndustries || ["restaurant"],
        active_capabilities: profile.selectedCapabilities || ["order_taker", "reservation", "book_appointment"],
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

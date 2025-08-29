import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Complaint from "@/models/Complaint";
import { sendEmail } from "@/lib/mailer";


export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await context.params;   // ✅ must await params

  try {
    const data = await req.json();

    const allowed = ["status", "priority", "category"];
    const update: Partial<Record<string, string>> = {};

    for (const key of allowed) {
      if (key in data) update[key] = data[key];
    }

    const complaint = await Complaint.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!complaint) {
      return NextResponse.json(
        { message: "Complaint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(complaint);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}




export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await context.params;  // ✅ await params

  try {
    const complaint = await Complaint.findByIdAndDelete(id);
    if (!complaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

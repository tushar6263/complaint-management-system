import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Complaint from "@/models/Complaint";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const { title, description, category, priority } = body;

    if (!title || !description || !category || !priority) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
    });

    // notify admin on new complaint
    await sendEmail(
      process.env.ADMIN_EMAIL!,
      "🆕 New Complaint Submitted",
      `
      <h2>${complaint.title}</h2>
      <p><b>Category:</b> ${complaint.category}</p>
      <p><b>Priority:</b> ${complaint.priority}</p>
      <p><b>Description:</b></p>
      <p>${complaint.description}</p>
      <p><i>Submitted: ${new Date(complaint.dateSubmitted).toLocaleString()}</i></p>
      `
    );

    return NextResponse.json(complaint, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    const query: any = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const complaints = await Complaint.find(query)
      .sort({ dateSubmitted: -1 })
      .lean();

    return NextResponse.json({ complaints });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

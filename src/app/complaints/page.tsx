import ComplaintForm from "@/components/ComplaintForm";

export default function ComplaintsPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-start py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Submit Your Complaint</h1>
      <ComplaintForm />
    </div>
  );
}

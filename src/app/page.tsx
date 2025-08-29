import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Complaint Management System</h1>
      <p className="text-lg text-gray-700 mb-8 max-w-xl">
        Users can submit complaints and administrators can view, filter, update and delete them.
        Email notifications are sent on new submissions and status updates.
      </p>

      <div className="flex gap-4">
        <Link href="/complaints" className="px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600">
          Submit Complaint
        </Link>
        <Link href="/admin" className="px-6 py-3 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-900">
          Admin Dashboard
        </Link>
      </div>
    </div>
  );
}

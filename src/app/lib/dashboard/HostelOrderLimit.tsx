import axiosInstance from "@/api/axiosInstance";
import { useEffect, useState } from "react";

type HostelSummary = {
  id: number;
  hostel_name: string;
  college_name: string;
  number_of_rooms: number;
  number_of_students: number;
};

const HostelOrderLimit = () => {
  const [hostelData, setHostelData] = useState<HostelSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHostelData = async () => {
      try {
        const response = await axiosInstance.get("admin/hostels-summary/");
        setHostelData(response.data);
        console.log(response.data)
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching hostel summary data:", error);
        setError(
          error.response?.data?.message || "Failed to fetch hostel summary data"
        );
        setLoading(false);
      }
    };

    fetchHostelData();
  }, []);

  if (loading) {
    return <div>Loading Hostel Data...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Hostel Summary</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-left">
              <th className="py-2 px-4 border-b">Hostel Name</th>
              <th className="py-2 px-4 border-b">College Name</th>
              <th className="py-2 px-4 border-b">Number of Rooms</th>
              <th className="py-2 px-4 border-b">Number of Students</th>
            </tr>
          </thead>
          <tbody>
            {hostelData.map((hostel) => (
              <tr key={hostel.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="py-2 px-4 border-b">{hostel.hostel_name}</td>
                <td className="py-2 px-4 border-b">{hostel.college_name}</td>
                <td className="py-2 px-4 border-b">{hostel.number_of_rooms}</td>
                <td className="py-2 px-4 border-b">{hostel.number_of_students}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HostelOrderLimit;

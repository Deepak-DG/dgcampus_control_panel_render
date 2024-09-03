"use client";

import axiosInstance from "@/api/axiosInstance";
import { useEffect, useState } from "react";

type HostelSlotCountData = {
  hostel_name: string;
  slot_count: number;
};

const HostelSlotCount = () => {
  const [hostelSlotCounts, setHostelSlotCounts] = useState<
    HostelSlotCountData[] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHostelSlotCounts = async () => {
      try {
        const response = await axiosInstance.get("hostel-slot-counts/");
        setHostelSlotCounts(response.data);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching hostel slot count data:", error);
        setError(
          error.response?.data?.message ||
            "Failed to fetch hostel slot count data"
        );
        setLoading(false);
      }
    };

    fetchHostelSlotCounts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="py-4 dark:text-black">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Hostel Slot Count</h1>
      {hostelSlotCounts && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {hostelSlotCounts.map((hostel, index) => (
            <div key={index} className="p-4 bg-green-100 rounded-lg shadow">
              <h2 className="text-lg font-semibold">{hostel.hostel_name}</h2>
              <p className="text-2xl">{hostel.slot_count}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HostelSlotCount;

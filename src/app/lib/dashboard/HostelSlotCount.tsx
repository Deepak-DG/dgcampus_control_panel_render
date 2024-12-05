"use client";

import axiosInstance from "@/api/axiosInstance";
import { useEffect, useState } from "react";

type HostelSlotCountData = {
  hostel_name: string;
  slot_count: number;
  order_count: number;
};

const HostelSlotCount = () => {
  const [hostelSlotCounts, setHostelSlotCounts] = useState<
    HostelSlotCountData[] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  ); // Default to today's date

  const fetchHostelSlotCounts = async (date: string) => {
    setLoading(true); // Set loading to true when fetching data

    try {
      const response = await axiosInstance.get(
        `hostel-slot-counts/?date=${date}`
      );
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

  useEffect(() => {
    fetchHostelSlotCounts(selectedDate);
  }, [selectedDate]);

  // Handle date input change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

// Functions to set the date to today, tomorrow, and yesterday
const setToday = () => {
  setSelectedDate(new Date().toISOString().slice(0, 10));
};

const setTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  setSelectedDate(tomorrow.toISOString().slice(0, 10));
};

const setYesterday = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  setSelectedDate(yesterday.toISOString().slice(0, 10));
};

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="py-4 dark:text-black">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">
        Hostel Slot Order Count
      </h1>

      {/* Date input for filtering */}
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2 dark:text-white">
          Select Date:
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="border border-gray-300 rounded-md p-2 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div className="flex gap-2 m-4">
          <button
            onClick={setToday}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          >
            Today
          </button>
          <button
            onClick={setTomorrow}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          >
            Tomorrow
          </button>
          <button
            onClick={setYesterday}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          >
            Yesterday
          </button>
        </div>
        {hostelSlotCounts  && hostelSlotCounts.length === 0 ? (
        <div className="dark:text-white" >No slots available for the selected date.</div>
      ) : (
        hostelSlotCounts && (        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-green-100">
                <th className="text-left p-4 border-b font-semibold text-lg">
                  Hostel Name
                </th>
                <th className="text-left p-4 border-b font-semibold text-lg">
                  Slot Count
                </th>
                <th className="text-left p-4 border-b font-semibold text-lg">
                  Order Count
                </th>
                </tr>
            </thead>
            <tbody>
              {hostelSlotCounts.map((hostel, index) => (
                <tr
                  key={index}
                  className="border-b  dark:bg-gray-900 dark:text-white"
                >
                  <td className="p-4">{hostel.hostel_name}</td>
                  <td className="p-4">{hostel.slot_count}</td>
                  <td className="p-4">{hostel.order_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default HostelSlotCount;

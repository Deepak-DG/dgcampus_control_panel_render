'use client';

import axiosInstance from '@/api/axiosInstance';
import React, { useState, useEffect } from 'react';

interface Holiday {
  id: number;
  date: string;
  reason: string;
  created_at: string;
}

interface ExceptionalDay {
  id: number;
  groups: { id: number; hostel_group_name: string }[];
  date: string;
  max_orders: number;
  reason: string;
  created_at: string;
}

interface CalendarDay {
  date: string;
  type: 'holiday' | 'exceptional' | 'serving_group';
  details: Holiday | ExceptionalDay | { group_name: string }[] | null;
}

interface HostelGroup {
  id: number;
  hostel_group_name: string;
}

const AdminCalendarPage: React.FC = () => {
  const [calendar, setCalendar] = useState<CalendarDay[]>([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [type, setType] = useState<'holiday' | 'exceptional'>('holiday');
  const [reason, setReason] = useState<string>('');
  const [maxOrders, setMaxOrders] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<HostelGroup[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);

  const fetchCalendar = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('admin-calendar/calendar', {
        params: { year, month },
      });
      setCalendar(response.data);
    } catch (err) {
      setError('Failed to fetch calendar data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axiosInstance.get('hostel-groups/');
      setGroups(response.data.results || []);
    } catch (err) {
      setError('Failed to fetch hostel groups.');
      console.error(err);
    }
  };

  const handleAddOrUpdateEvent = async () => {
    try {
      setError(null);

      if (!selectedDate) {
        setError('Please select a date.');
        return;
      }

      if (type === 'holiday') {
        if (editMode) {
          await axiosInstance.put(`admin-calendar/update_holiday/${editId}/`, {
            date: selectedDate,
            reason,
          });
        } else {
          await axiosInstance.post('admin-calendar/add_holiday/', {
            date: selectedDate,
            reason,
          });
        }
      } else {
        if (selectedGroups.length === 0) {
          setError('Please select at least one group for an exceptional day.');
          return;
        }

        const payload = {
          date: selectedDate,
          reason,
          max_orders: maxOrders,
          groups: selectedGroups,
        };

        if (editMode) {
          await axiosInstance.put(
            `admin-calendar/update_exceptional_day/${editId}/`,
            payload
          );
        } else {
          await axiosInstance.post('admin-calendar/add_exceptional_day/', payload);
        }
      }

      resetModal();
      fetchCalendar();
    } catch (err) {
      setError('Failed to add or update event. Please try again.');
      console.error(err);
    }
  };

  const handleDeleteEvent = async (id: number, eventType: 'holiday' | 'exceptional') => {
    try {
      setError(null);
      const endpoint =
        eventType === "holiday"
          ? `admin-calendar/delete_holiday/${id}/`
          : `admin-calendar/delete_exceptional_day/${id}/`;

          console.log(endpoint);
      await axiosInstance.delete(endpoint);
      fetchCalendar();
    } catch (err) {
      setError('Failed to delete the event. Please try again.');
      console.error(err);
    }
  };

  const resetModal = () => {
    setSelectedDate(null);
    setType('holiday');
    setReason('');
    setMaxOrders(0);
    setSelectedGroups([]);
    setEditMode(false);
    setEditId(null);
  };

  useEffect(() => {
    fetchCalendar();
    fetchGroups();
  }, [year, month]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Calendar</h1>

      {/* Year and Month Selectors */}
      <div className="flex gap-4 mb-6">
        <select
          className="border p-2 rounded"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {Array.from({ length: 5 }).map((_, idx) => (
            <option key={idx} value={new Date().getFullYear() - 2 + idx}>
              {new Date().getFullYear() - 2 + idx}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }).map((_, idx) => (
            <option key={idx} value={idx + 1}>
              {new Date(0, idx).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={fetchCalendar}
        >
          Load Calendar
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Loading Indicator */}
      {loading ? (
        <div className="text-center text-blue-500 font-bold">Loading...</div>
      ) : (
        <div className="grid grid-cols-7 gap-4 text-center">
          {calendar.map((day) => (
            <div
              key={day.date}
              className={`border rounded p-4 cursor-pointer ${
                day.type === "holiday"
                  ? "bg-red-100"
                  : day.type === "exceptional"
                  ? "bg-yellow-100"
                  : "bg-green-100"
              }`}
              onClick={() => {
                // Ensure only `holiday` or `exceptional` types are handled
                if (day.type === "holiday") {
                  setSelectedDate(day.date);
                  setType("holiday");
                  setReason((day.details as Holiday).reason || "");
                  setEditMode(true);
                  setEditId((day.details as Holiday).id);
                } else if (day.type === "exceptional") {
                  setSelectedDate(day.date);
                  setType("exceptional");
                  const exceptional = day.details as ExceptionalDay;
                  setReason(exceptional.reason || "");
                  setMaxOrders(exceptional.max_orders || 0);
                  setSelectedGroups(
                    exceptional.groups.map((group) => group.id)
                  );
                  setEditMode(true);
                  setEditId(exceptional.id);
                }
              }}
            >
              <p className="font-bold">{day.date}</p>
              <p>
                {day.type === "holiday" && (
                  <>
                    <span>Holiday:</span> {(day.details as Holiday)?.reason}
                  </>
                )}
                {day.type === "exceptional" && (
                  <>
                    <span>Exceptional Day:</span>{" "}
                    {(day.details as ExceptionalDay)?.reason}
                    <br />
                    <span>Groups:</span>{" "}
                    {(day.details as ExceptionalDay)?.groups
                      .map((group) => group.hostel_group_name)
                      .join(", ")}
                    <br />
                    <span>Max Orders:</span>{" "}
                    {(day.details as ExceptionalDay)?.max_orders}
                  </>
                )}
                {day.type === "serving_group" && day.details && (
                  <>
                    <span>Serving Group:</span>{" "}
                    {(day.details as { group_name: string }[])
                      .map((group) => group.group_name)
                      .join(", ")}
                  </>
                )}
                {day.type === "serving_group" && !day.details && (
                  <span>No serving groups available</span>
                )}
              </p>
              {/* Delete button only for `holiday` and `exceptional` */}
              {day.type !== "serving_group" && (
                <button
                  className="text-red-500 mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (day.type === "holiday" || day.type === "exceptional") {
                      handleDeleteEvent(
                        day.type === "holiday"
                          ? (day.details as Holiday).id
                          : (day.details as ExceptionalDay).id,
                        day.type
                      );
                    }
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal for Adding/Updating Events */}
      {selectedDate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editMode ? "Edit Event" : "Add Event"}
            </h2>
            <p className="mb-2">Selected Date: {selectedDate}</p>
            <select
              className="border p-2 rounded mb-4 w-full"
              value={type}
              onChange={(e) =>
                setType(e.target.value as "holiday" | "exceptional")
              }
              disabled={editMode}
            >
              <option value="holiday">Holiday</option>
              <option value="exceptional">Exceptional Day</option>
            </select>
            <input
              type="text"
              className="border p-2 rounded mb-4 w-full"
              placeholder="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            {type === "exceptional" && (
              <>
                <select
                  multiple
                  className="border p-2 rounded mb-4 w-full"
                  value={selectedGroups.map(String)}
                  onChange={(e) =>
                    setSelectedGroups(
                      Array.from(e.target.selectedOptions, (option) =>
                        Number(option.value)
                      )
                    )
                  }
                >
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.hostel_group_name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  className="border p-2 rounded mb-4 w-full"
                  placeholder="Max Orders"
                  value={maxOrders}
                  onChange={(e) => setMaxOrders(Number(e.target.value))}
                />
              </>
            )}
            <div className="flex gap-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleAddOrUpdateEvent}
              >
                {editMode ? "Update" : "Add"}
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={resetModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCalendarPage;

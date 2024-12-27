"use client";
import { useState } from "react";
import { useLogout } from "@/app/lib/Auth/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const logout = useLogout();

  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  // const getLinkClass = (path: string) => {
  //   return `py-2 px-4 rounded mt-2 ${pathname === path ? "bg-violet-400" : ""}`;
  // };

  const getLinkClass = (path: string) =>
    `py-2 px-4 rounded block ${
      pathname === path ? "bg-violet-400 text-white" : "text-gray-800 dark:text-gray-300"
    }`;

    const isOpen = (section: string) => openSections.includes(section);

  return (
    <aside className="w-64 h-full sticky top-16 dark:bg-gray-900 bg-violet-300 dark:text-white flex flex-col">
      <nav className="flex-1 flex flex-col overflow-auto p-4 space-y-4">
        {/* Dashboard */}
        <div>
          <button
            className="w-full text-left font-semibold py-2 px-4"
            onClick={() => toggleSection("dashboard")}
          >
            Dashboard
          </button>
          {isOpen("dashboard") && (
            <div className="ml-4 space-y-2">
              <Link href="/dashboard" className={getLinkClass("/dashboard/")}>
                Overview
              </Link>
              <Link
                href="/dashboard/staff-performance"
                className={getLinkClass("/dashboard/staff-performance/")}
              >
                Staff Performance
              </Link>
              <Link
                href="/dashboard/order-analytics"
                className={getLinkClass("/dashboard/order-analytics/")}
              >
                Order Analytics
              </Link>
            </div>
          )}
        </div>

        {/* Staff Management */}
        <div>
          <button
            className="w-full text-left font-semibold py-2 px-4"
            onClick={() => toggleSection("staff")}
          >
            Staff Management
          </button>
          {isOpen("staff") && (
            <div className="ml-4 space-y-2">
              <Link
                href="/dashboard/staffs"
                className={getLinkClass("/dashboard/staffs/")}
              >
                Staffs
              </Link>
              <Link
                href="/dashboard/roles"
                className={getLinkClass("/dashboard/roles/")}
              >
                Roles
              </Link>

              <Link
                href="/dashboard/staff-errors"
                className={getLinkClass("/dashboard/staff-errors/")}
              >
                Staff Errors
              </Link>
            </div>
          )}
        </div>

        {/* Student Management */}
        <div>
          <button
            className="w-full text-left font-semibold py-2 px-4"
            onClick={() => toggleSection("students")}
          >
            Student Management
          </button>
          {isOpen("students") && (
            <div className="ml-4 space-y-2">
              <Link
                href="/dashboard/students"
                className={getLinkClass("/dashboard/students/")}
              >
                Students
              </Link>
              <Link
                href="/dashboard/otps"
                className={getLinkClass("/dashboard/otps/")}
              >
                OTPs
              </Link>
            </div>
          )}
        </div>

        {/* Order Management */}
        <div>
          <button
            className="w-full text-left font-semibold py-2 px-4"
            onClick={() => toggleSection("orders")}
          >
            Order Management
          </button>
          {isOpen("orders") && (
            <div className="ml-4 space-y-2">
              <Link
                href="/dashboard/orders"
                className={getLinkClass("/dashboard/orders/")}
              >
                Orders
              </Link>
              <Link
                href="/dashboard/washing-details"
                className={getLinkClass("/dashboard/washing-details/")}
              >
                Washing Details
              </Link>

              <Link
                href="/dashboard/folding-details"
                className={getLinkClass("/dashboard/folding-details/")}
              >
                Folding Details
              </Link>

              <Link
                href="/dashboard/ironing-details"
                className={getLinkClass("/dashboard/ironing-details/")}
              >
                Ironing Details
              </Link>

              <Link
                href="/dashboard/order-ratings"
                className={getLinkClass("/dashboard/order-ratings/")}
              >
                Orders Ratings
              </Link>
            </div>
          )}
        </div>

        {/* Pickup Management */}
        <div>
          <button
            className="w-full text-left font-semibold py-2 px-4"
            onClick={() => toggleSection("pickups")}
          >
            Pickup Management
          </button>
          {isOpen("pickups") && (
            <div className="ml-4 space-y-2">
              <Link
                href="/dashboard/exceptional-limit-days"
                className={getLinkClass("/dashboard/exceptional-limit-days/")}
              >
                Exceptional Limit Days
              </Link>
              <Link
                href="/dashboard/holidays"
                className={getLinkClass("/dashboard/holidays/")}
              >
                Holidays
              </Link>
              <Link
                href="/dashboard/default-hostel-groups"
                className={getLinkClass("/dashboard/default-hostel-groups/")}
              >
                Default Hostel Groups
              </Link>
              <Link
                href="/dashboard/free-pickup-calendar"
                className={getLinkClass("/dashboard/free-pickup-calendar/")}
              >
                Free Pickup Calendar
              </Link>
            </div>
          )}
        </div>

        {/* Log Management */}
        <div>
          <button
            className="w-full text-left font-semibold py-2 px-4"
            onClick={() => toggleSection("logs")}
          >
            Log Management
          </button>
          {isOpen("logs") && (
            <div className="ml-4 space-y-2">
              <Link
                href="/dashboard/whatsapp-message-logs"
                className={getLinkClass("/dashboard/whatsapp-message-logs/")}
              >
                WhatsApp Message Logs
              </Link>
              <Link
                href="/dashboard/student-auth-whatsapp-logs"
                className={getLinkClass(
                  "/dashboard/student-auth-whatsapp-logs/"
                )}
              >
                Student Auth Whatsapp Logs
              </Link>
              <Link
                href="/dashboard/money-found"
                className={getLinkClass("/dashboard/money-found/")}
              >
                Money Found
              </Link>
            </div>
          )}
        </div>

        {/* Hostel Management */}
        <div>
          <button
            className="w-full text-left font-semibold py-2 px-4"
            onClick={() => toggleSection("hostels")}
          >
            Hostel Management
          </button>
          {isOpen("hostels") && (
            <div className="ml-4 space-y-2">
              <Link
                href="/dashboard/rooms"
                className={getLinkClass("/dashboard/rooms/")}
              >
                Rooms
              </Link>

              <Link
                href="/dashboard/hostel-groups"
                className={getLinkClass("/dashboard/hostel-groups/")}
              >
                Hostel Groups
              </Link>
              <Link
                href="/dashboard/hostels"
                className={getLinkClass("/dashboard/hostels/")}
              >
                Hostels
              </Link>
              <Link
                href="/dashboard/colleges"
                className={getLinkClass("/dashboard/colleges/")}
              >
                Colleges
              </Link>
            </div>
          )}
        </div>

        {/* User Management */}
        <div>
          <button
            className="w-full text-left font-semibold py-2 px-4"
            onClick={() => toggleSection("users")}
          >
            User Management
          </button>
          {isOpen("users") && (
            <div className="ml-4 space-y-2">
              <Link
                href="/dashboard/users"
                className={getLinkClass("/dashboard/users/")}
              >
                Users
              </Link>
            </div>
          )}
        </div>

        {/* Slot Management */}
        <div>
          <button
            className="w-full text-left font-semibold py-2 px-4"
            onClick={() => toggleSection("slots")}
          >
            Slot Management
          </button>
          {isOpen("slots") && (
            <div className="ml-4 space-y-2">
              <Link
                href="/dashboard/slots"
                className={getLinkClass("/dashboard/slots/")}
              >
                Slots
              </Link>
            </div>
          )}
        </div>
      </nav>
      <Link href="/pack" className={getLinkClass("/pack/")}>
        Pack
      </Link>
      <footer className="p-4">
        <button className="w-full bg-red-500 p-2 text-white" onClick={logout}>
          Logout
        </button>
      </footer>
    </aside>
  );
};

export default Sidebar;

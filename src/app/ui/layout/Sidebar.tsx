"use client";

import { useLogout } from "@/app/lib/Auth/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const logout = useLogout();

  const getLinkClass = (path: string) => {
    return `py-2 px-4 rounded mt-2 ${pathname === path ? "bg-violet-400" : ""}`;
  };

  return (
    <aside className="w-64 h-full sticky top-16 bg-gray-900 text-white flex flex-col">
      <nav className="flex-1 flex flex-col overflow-auto p-4">
        <Link href="/dashboard" className={getLinkClass("/dashboard/")}>
          Dashboard
        </Link>
        <Link
          href="/dashboard/staff-performance"
          className={getLinkClass("/dashboard/staff-performance/")}
        >
          Staff Performance
        </Link>
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
        
        <Link
          href="/dashboard/student-auth-whatsapp-logs"
          className={getLinkClass("/dashboard/student-auth-whatsapp-logs/")}
        >
          Student Auth Whatsapp Logs
        </Link>

        <Link
          href="/dashboard/staffs"
          className={getLinkClass("/dashboard/staffs/")}
        >
          Staffs
        </Link>
        <Link
          href="/dashboard/users"
          className={getLinkClass("/dashboard/users/")}
        >
          Users
        </Link>
        <Link
          href="/dashboard/rooms"
          className={getLinkClass("/dashboard/rooms/")}
        >
          Rooms
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
        <Link
          href="/dashboard/slots"
          className={getLinkClass("/dashboard/slots/")}
        >
          Slots
        </Link>
        <Link
          href="/dashboard/orders"
          className={getLinkClass("/dashboard/orders/")}
        >
          Orders
        </Link>

        <Link
          href="/dashboard/whatsapp-message-logs"
          className={getLinkClass("/dashboard/whatsapp-message-logs/")}
        >
          WhatsApp Message Logs
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
          href="/dashboard/laundry-manager-logs"
          className={getLinkClass("/dashboard/laundry-manager-logs/")}
        >
          Laundry Manager Logs
        </Link>
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

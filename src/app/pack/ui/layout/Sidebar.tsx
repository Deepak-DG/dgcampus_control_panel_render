"use client";

import { useLogout } from "@/app/lib/Auth/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const logout = useLogout();

  const getLinkClass = (path: string) => {
    return `py-2 px-4 rounded mt-2 ${pathname === path ? "bg-blue-700" : ""}`;
  };

  return (
    <aside className="w-64 h-full sticky top-16 bg-blue-900 text-white flex flex-col">
      <nav className="flex-1 flex flex-col overflow-auto p-4">
        <h3 className="text-lg font-bold">DG Pack</h3>
        <Link href="/pack" className={getLinkClass("/pack/")}>
          Dashboard
        </Link>
        <Link href="/pack/users" className={getLinkClass("/pack/users")}>
          Users
        </Link>

        <Link
          href="/pack/whatsapp-logs"
          className={getLinkClass("/pack/whatsapp-logs")}
        >
          Whatsapp Logs
        </Link>
        <Link href="/pack/otp" className={getLinkClass("/pack/otp")}>
          OTP
        </Link>
        <Link href="/pack/address" className={getLinkClass("/pack/address")}>
          Address
        </Link>
        <Link
          href="/pack/pincode"
          className={getLinkClass("/dashboard/pack/pincode/")}
        >
          Pincode
        </Link>
        <Link
          href="/pack/selected-pincode"
          className={getLinkClass("/pack/selected-pincode/")}
        >
          Selected Pincode
        </Link>
        <Link href="/pack/service" className={getLinkClass("/pack/service/")}>
          Service
        </Link>
        <Link
          href="/pack/selected-service"
          className={getLinkClass("/pack/selected-service/")}
        >
          Selected Service
        </Link>
        <Link
          href="/pack/subscription"
          className={getLinkClass("/pack/subscription/")}
        >
          Subscription
        </Link>
        <Link
          href="/pack/pickup-schedule"
          className={getLinkClass("/pack/pickup-schedule/")}
        >
          Pickup Schedule
        </Link>
        <Link
          href="/pack/selected-subscription"
          className={getLinkClass("/pack/selected-subscription/")}
        >
          Selected Subscription
        </Link>
        <Link
          href="/pack/confirm-subscription"
          className={getLinkClass("/pack/confirm-subscription/")}
        >
          Confirm Subscription
        </Link>
        <Link href="/pack/payment" className={getLinkClass("/pack/payment/")}>
          Payment
        </Link>

        <Link
          href="/pack/phonepe-transactions"
          className={getLinkClass("/pack/phonepe-transactions/")}
        >
          Phonepe Transactions
        </Link>
      </nav>

      <Link href="/dashboard/" className={getLinkClass("/dashboard/")}>
        DG Campus
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

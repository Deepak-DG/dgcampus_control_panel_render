import NavBar from "../ui/layout/NavBar";
import Sidebar from "../ui/layout/Sidebar";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4 dark:bg-slate-950 dark:text-white text-black">
          {children}
        </main>
      </div>
    </div>
  );
}

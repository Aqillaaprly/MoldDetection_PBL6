import "../globals.css"
import Navbar from "@/components/layout/navbar/Navbar"
import Sidebar from "@/components/layout/Sidebar"
import BottomNav from "@/components/layout/BottomNav"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <Navbar />

        {/* pb-20 di mobile supaya konten tidak tertutup BottomNav */}
        <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden pb-20 md:pb-6">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
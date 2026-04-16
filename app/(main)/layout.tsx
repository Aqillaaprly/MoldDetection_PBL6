import "../globals.css"
import Navbar from "@/components/layout/Navbar"
import Sidebar from "@/components/layout/Sidebar"

export default function RootLayout({
  children,
}:{
  children:React.ReactNode
}) {

  return (
    <html>
      <body className="bg-gray-100 dark:bg-gray-950">

        <div className="flex h-screen">

          <Sidebar/>

          <div className="flex flex-col flex-1">

            <Navbar/>

            <main className="p-6 overflow-y-auto">
              {children}
            </main>

          </div>

        </div>

      </body>
    </html>
  )
}
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body className="bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100">
        {children}
      </body>
    </html>
  )
}
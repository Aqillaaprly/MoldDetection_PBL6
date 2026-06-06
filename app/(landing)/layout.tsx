type LandingLayoutProps = {
  children: React.ReactNode
}

export default function LandingLayout({
  children
}: LandingLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f4f5f8] text-slate-950">
      {children}
    </div>
  )
}
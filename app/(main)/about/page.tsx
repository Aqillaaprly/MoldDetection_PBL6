import AboutSection from "@/components/about/AboutSection"

export default function AboutPage() {
  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          About System
        </h1>
      </div>

      <AboutSection />

    </div>
  )
}
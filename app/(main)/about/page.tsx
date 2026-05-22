import AboutSection from "@/components/about/AboutSection"

export default function AboutPage() {
  return (
    <div className="space-y-4 sm:space-y-6 pb-6">

      <div>
        <h1 className="text-2xl sm:text-2xl font-bold text-slate-800 dark:text-white">
          About System
        </h1>
      </div>

      <AboutSection />

    </div>
  )
}
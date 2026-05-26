import LandingNavbar from "@/components/landing/LandingNavbar"
import HeroSection from "@/components/landing/HeroSection"
import AboutSection from "@/components/landing/AboutSection"
import FeaturesSection from "@/components/landing/FeaturesSection"
import JourneySection from "@/components/landing/JourneySection"
import CtaSection from "@/components/landing/CtaSection"
import LandingFooter from "@/components/landing/LandingFooter"

export default function LandingPage() {
  return (
    <main>
      <LandingNavbar />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <JourneySection />
      <CtaSection />
      <LandingFooter />
    </main>
  )
}
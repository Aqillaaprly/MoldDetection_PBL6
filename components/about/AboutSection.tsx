import AboutContainer from "./AboutContainer"
import SystemFlow from "./SystemFlow"
import TeamCard from "./TeamCard"

import { FileText, Target, Cpu, Lightbulb, Users } from "lucide-react"

export default function AboutSection() {
  return (
    <div className="space-y-6">

      {/* TOP GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* DESKRIPSI */}
        <AboutContainer
          title="Deskripsi"
          icon={<FileText size={18} />}
          variant="gradient"
        >
          <p className="mt-2">
            MoldGuard is a system with IoT based application used to detect potential mold growth based on temerature, humidity, and light in real-time.
            This system works by collecting data from sensors and can also automate devices like air purifiers to maintain air quality.
            The system will help users to detect mold growth early, maintain air quality, and automate the devices for better efficiency in 
            maintaining a healthy indoor environment.

          </p>
          <p className="mt-2">
            This system also capable of automating devices such as air purifiers to maintain air quality.
            With this system, users can monitor the conditions of their indoor environment and take necessary actions to prevent mold growth and maintain 
            a healthy living space.
            This feature also helps users to save energy and improve the efficiency of their devices by automating them based on the sensor data.
          </p>
        </AboutContainer>

        {/* KANAN */}
        <div className="flex flex-col gap-6">

          <AboutContainer
            title="Tujuan"
            icon={<Target size={18} />}
            iconBg="bg-green-100 text-green-600"
          >
            <ul className="list-disc ml-5">
              <li>Early detection of mold growth</li>
              <li>Maintaining air quality</li>
              <li>System automation</li>
            </ul>
          </AboutContainer>

          <AboutContainer
            title="Teknologi"
            icon={<Cpu size={18} />}
            iconBg="bg-purple-100 text-purple-600"
          >
            <ul className="list-disc ml-5">
              <li>Next.js</li>
              <li>IoT Sensor</li>
              <li>Cloud Database</li>
            </ul>
          </AboutContainer>

        </div>
      </div>

      {/* CARA KERJA */}
      <AboutContainer
        title="Cara Kerja Sistem"
        icon={<Lightbulb size={18} />}
        iconBg="bg-yellow-100 text-yellow-600"
      >
        <SystemFlow />
      </AboutContainer>

      {/* TIM */}
      <AboutContainer
        title="Tim Pengembang"
        icon={<Users size={18} />}
        iconBg="bg-pink-100 text-pink-600"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <TeamCard
            name="Aqilla Aprily"
            role=""
            image="/team/aqilla.jpeg"
          />

          <TeamCard
            name="Febrian Arka Samudra"
            role=""
            image="/team/arka.jpeg"
          />

          <TeamCard
            name="Muhammad Atho’illah Mu’thisyah"
            role=""
            image="/team/faiz.jpeg"
          />

          <TeamCard
            name="Sherly Lutfi Azkiah Sulistyawati"
            role=""
            image="/team/sherly.jpeg"
          />

        </div>
      </AboutContainer>

    </div>
  )
}
import AboutContainer from "./AboutContainer"
import SystemFlow from "./SystemFlow"
import TeamCard from "./TeamCard"

import { FileText, Target, Cpu, Lightbulb, Users } from "lucide-react"

export default function AboutSection() {
  return (
    <div className="p-6 space-y-6">

      {/* TOP GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* DESKRIPSI */}
        <AboutContainer
          title="Deskripsi"
          icon={<FileText size={18} />}
          variant="gradient"
        >
          <p>
            Sistem ini merupakan aplikasi berbasis IoT yang digunakan untuk
            mendeteksi potensi pertumbuhan jamur berdasarkan suhu, kelembapan,
            dan cahaya secara real-time.
          </p>
          <p className="mt-2">
            Sistem ini juga mampu melakukan otomatisasi perangkat seperti air
            purifier untuk menjaga kualitas udara.
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
              <li>Mendeteksi jamur lebih awal</li>
              <li>Menjaga kualitas udara</li>
              <li>Otomatisasi sistem</li>
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
            role="Frontend Developer"
            image="/team/aqilla.jpg"
          />

          <TeamCard
            name="Nama 2"
            role="Backend Developer"
            image="/team/user2.jpg"
          />

          <TeamCard
            name="Nama 3"
            role="IoT Engineer"
            image="/team/user3.jpg"
          />

          <TeamCard
            name="Nama 4"
            role="Data Analyst"
            image="/team/user4.jpg"
          />

        </div>
      </AboutContainer>

    </div>
  )
}
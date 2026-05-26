import Image from "next/image"

export default function AboutSection() {
  return (
    <section
      id="about"
      className="bg-[#eef0f4] py-24"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 md:grid-cols-2">
        <div>
          <span className="mb-4 inline-block text-sm font-semibold text-blue-700">
            ABOUT MOLDGUARD
          </span>

          <h2 className="mb-5 text-3xl font-semibold text-slate-950">
            A Simple Way to Keep Your Room Healthier
          </h2>

          <p className="max-w-md text-sm leading-7 text-slate-600">
            MoldGuard helps you understand your room conditions more easily.
            By monitoring humidity, temperature, and mold risk in real time,
            MoldGuard makes it easier to notice problems early before they
            affect your room comfort and indoor air quality.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <img
            src="/images/landing/sensor.png"
            alt="MoldGuard sensor device"
            width={500}
            height={500}
            className="mt-16 h-56 w-full rounded-2xl border-8 border-white object-cover shadow-lg"
          />

          <img
            src="/images/landing/room.png"
            alt="Healthy indoor room"
            width={500}
            height={500}
            className="h-64 w-full rounded-2xl border-8 border-white object-cover shadow-lg"
          />
        </div>
      </div>
    </section>
  )
}
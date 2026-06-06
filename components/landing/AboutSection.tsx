export default function AboutSection() {
  return (
    <section id="about" className="bg-[#eef0f4] py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-2 md:gap-14">
        <div>
          <span className="mb-4 inline-block text-sm font-semibold text-indigo-600">
            ABOUT MOLDGUARD
          </span>
          <h2 className="mb-5 text-2xl font-semibold text-slate-950 md:text-3xl">
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
            className="mt-8 h-44 w-full rounded-2xl border-8 border-white object-cover shadow-lg md:mt-16 md:h-56"
          />
          <img
            src="/images/landing/room.png"
            alt="Healthy indoor room"
            className="h-52 w-full rounded-2xl border-8 border-white object-cover shadow-lg md:h-64"
          />
        </div>
      </div>
    </section>
  )
}
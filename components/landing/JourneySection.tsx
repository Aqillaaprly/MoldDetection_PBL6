const steps = [
  {
    number: "1",
    title: "Sensors Read Room Conditions",
    description:
      "MoldGuard reads humidity, temperature, and light data from the room."
  },
  {
    number: "2",
    title: "Data Updates Automatically",
    description:
      "The latest room condition data is sent and updated on the system."
  },
  {
    number: "3",
    title: "Dashboard Shows the Status",
    description:
      "You can view room condition, mold risk, and monitoring history clearly."
  },
  {
    number: "4",
    title: "Alerts Help You Act Earlier",
    description:
      "MoldGuard gives alerts when room conditions need attention."
  }
]

export default function JourneySection() {
  return (
    <section
      id="how-it-works"
      className="bg-[#eef0f4] py-22"
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-[0.8fr_1.2fr]">
        <div
          id="why"
          className="rounded-3xl bg-blue-700 p-10 text-white shadow-lg shadow-blue-200"
        >
          <span className="mb-4 inline-block text-sm font-semibold text-blue-200">
            WHY MOLDGUARD?
          </span>

          <h2 className="mb-6 text-3xl font-semibold">
            Prevent Mold Problems Before They Get Worse
          </h2>

          <p className="mb-20 text-sm leading-6 text-blue-100">
            High humidity can make a room feel uncomfortable and increase the
            chance of mold growth. MoldGuard helps you monitor room conditions
            earlier, so you can take action before the problem becomes serious.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/10 p-5">
              <h3 className="text-2xl font-bold">24/7</h3>
              <p className="text-xs text-blue-100">
                Monitoring
              </p>
            </div>

            <div className="rounded-xl bg-white/10 p-5">
              <h3 className="text-2xl font-bold">Real-Time</h3>
              <p className="text-xs text-blue-100">
                Updates
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-10 shadow-sm">
          <span className="mb-4 inline-block text-sm font-semibold text-blue-700">
            HOW IT WORKS
          </span>

          <h2 className="mb-8 text-xl font-semibold text-slate-950">
            Simple Monitoring Process
          </h2>

          <div className="space-y-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex gap-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-blue-700">
                  {step.number}
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold text-slate-950">
                    {step.title}
                  </h3>

                  <p className="text-xs leading-5 text-slate-500">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
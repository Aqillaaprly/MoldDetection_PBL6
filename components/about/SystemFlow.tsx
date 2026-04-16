const steps = [
  {
    title: "Sensor",
    desc: "Sensor membaca suhu, kelembapan, dan cahaya",
  },
  {
    title: "Kirim Data",
    desc: "Data dikirim ke server melalui internet",
  },
  {
    title: "Analisis",
    desc: "Sistem menganalisis potensi pertumbuhan jamur",
  },
  {
    title: "Dashboard",
    desc: "Data ditampilkan secara real-time",
  },
  {
    title: "Kontrol",
    desc: "Air purifier aktif otomatis jika diperlukan",
  },
]

export default function SystemFlow() {
  return (
    <div className="overflow-x-auto">
      <div className="flex items-center gap-6 min-w-max">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 w-48 text-center">
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-sm text-gray-500 mt-2">
                {step.desc}
              </p>
            </div>

            {index < steps.length - 1 && (
              <div className="mx-3 text-yellow-500 text-xl font-bold">
                →
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  )
}
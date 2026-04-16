export default function ZoneCalibration() {

  return (
    <div className="bg-white rounded-3xl p-7 shadow-sm">

      <h3 className="text-lg font-semibold mb-3">
        Zone Calibration
      </h3>

      <p className="text-sm text-slate-500 leading-relaxed">
        Fine-tune the moisture extraction parameters for the
        <span className="text-indigo-600 font-semibold">
          {" "}East Laboratory Wing.
        </span>
        This overrides global automation presets for 24 hours.
      </p>

    </div>
  )
}
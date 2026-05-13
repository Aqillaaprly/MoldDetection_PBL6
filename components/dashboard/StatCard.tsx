import clsx from "clsx"

type Props = {
  icon: React.ReactNode
  iconBg: string
  label: string
  value: string | number
  sub: string
  highlight?: string
}

export default function StatCard({
  icon,
  iconBg,
  label,
  value,
  sub,
  highlight
}: Props) {
  return (
    <div
      className={clsx(
        "bg-white dark:bg-gray-900",
        "rounded-2xl border border-gray-100 dark:border-gray-800",
        "shadow-sm",

        // desktop
        "sm:px-5 sm:py-4",

        // mobile compact
        "px-3 py-3"
      )}
    >
      <div className="flex items-center gap-3">

        {/* Icon */}
        <div
          className={clsx(
            "rounded-xl flex items-center justify-center shrink-0",

            // mobile
            "w-9 h-9",

            // desktop
            "sm:w-11 sm:h-11",

            iconBg
          )}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="min-w-0">

          {/* Label */}
          <p className="text-[11px] sm:text-xs text-gray-400 font-medium leading-tight">
            {label}
          </p>

          {/* Value */}
          <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight mt-0.5">
            {value}
          </p>

          {/* Desktop only sub text */}
          <div className="hidden sm:block">
            {highlight ? (
              <p className="text-xs mt-0.5">
                <span className="text-green-500 font-medium">
                  {highlight}
                </span>

                <span className="text-gray-400">
                  {" "}
                  {sub}
                </span>
              </p>
            ) : (
              <p className="text-xs text-gray-400 mt-0.5">
                {sub}
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
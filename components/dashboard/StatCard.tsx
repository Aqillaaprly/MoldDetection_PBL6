import clsx from "clsx"

type Props = {
  icon: React.ReactNode
  iconBg: string
  label: string
  value: string | number
  sub: string
}

export default function StatCard({
  icon,
  iconBg,
  label,
  value,
  sub
}: Props) {
  return (
    <div
      className={clsx(
        "bg-white dark:bg-gray-900",
        "rounded-2xl border border-gray-100 dark:border-gray-800",
        "shadow-sm",
        "sm:px-5 sm:py-4",
        "px-3 py-3",
        "sm:px-5 sm:py-4",
        "lg:min-h-[115px]",
        "flex items-center"
      )}
    >
      <div className="flex items-center gap-3">

        {/* Icon */}
        <div
          className={clsx(
            "rounded-xl flex items-center justify-center shrink-0",
            "w-9 h-9",
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

          {/* Sub */}
          <p className="hidden sm:block text-xs text-gray-400 mt-0.5">
            {sub}
          </p>

        </div>
      </div>
    </div>
  )
}
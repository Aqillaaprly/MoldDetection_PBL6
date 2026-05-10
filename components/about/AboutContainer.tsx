type Props = {
  title: string
  icon?: React.ReactNode
  iconBg?: string
  variant?: "default" | "gradient"
  children: React.ReactNode
}

export default function AboutContainer({
  title,
  icon,
  iconBg = "bg-gray-100",
  variant = "default",
  children,
}: Props) {
  const isGradient = variant === "gradient"

  return (
    <div
      className={`
        rounded-xl p-4 transition
        ${
          isGradient
            ? "bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600"
            : "bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800"
        }
      `}
    >

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-3">
        {icon && (
          <div
            className={`p-2 rounded-lg ${
              isGradient
                ? "bg-white/20 text-white"
                : `${iconBg} dark:bg-gray-800 dark:text-gray-200`
            }`}
          >
            {icon}
          </div>
        )}

        <h2
          className={`font-semibold text-sm uppercase ${
            isGradient
              ? "text-white/80"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {title}
        </h2>
      </div>

      {/* CONTENT */}
      <div
        className={`text-sm leading-relaxed ${
          isGradient
            ? "text-white"
            : "text-gray-600 dark:text-gray-300"
        }`}
      >
        {children}
      </div>
    </div>
  )
}
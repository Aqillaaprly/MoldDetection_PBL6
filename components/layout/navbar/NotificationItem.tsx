export default function NotificationItem({
  icon,
  title,
  desc,
  time,
  unread
}: {
  icon: React.ReactNode
  title: string
  desc: string
  time: string
  unread?: boolean
}) {

  return (
    <div className="flex gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition">

      <div className="mt-1">
        {icon}
      </div>

      <div className="flex-1">

        <div className="flex justify-between items-center">

          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {title}
          </p>

          <span className="text-xs text-gray-400">
            {time}
          </span>

        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          {desc}
        </p>

      </div>

      {unread && (
        <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2"/>
      )}

    </div>
  )
}
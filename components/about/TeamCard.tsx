type Props = {
  name: string
  role: string
  image: string
}

export default function TeamCard({
  name,
  role,
  image
}: Props) {
  return (
    <div className="flex items-center gap-3 sm:gap-4 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 sm:p-4 hover:shadow transition">

      <img
        src={image}
        alt={name}
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700 shrink-0"
      />

      <div className="min-w-0">
        <h3 className="font-semibold text-sm text-gray-800 dark:text-white truncate">
          {name}
        </h3>

        {role && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {role}
          </p>
        )}
      </div>

    </div>
  )
}
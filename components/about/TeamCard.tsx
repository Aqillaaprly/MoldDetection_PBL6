type Props = {
  name: string
  role: string
  image: string
}

export default function TeamCard({ name, role, image }: Props) {
  return (
    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 hover:shadow transition">

      <img
        src={image}
        alt={name}
        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
      />

      <div>
        <h3 className="font-semibold text-sm text-gray-800 dark:text-white">
          {name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">{role}</p>
      </div>

    </div>
  )
}
type Props = {
  name: string
  role: string
  image: string
}

export default function TeamCard({ name, role, image }: Props) {
  return (
    <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 hover:shadow transition">

      <img
        src={image}
        alt={name}
        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
      />

      <div>
        <h3 className="font-semibold text-sm">{name}</h3>
        <p className="text-xs text-gray-500">{role}</p>
      </div>

    </div>
  )
}
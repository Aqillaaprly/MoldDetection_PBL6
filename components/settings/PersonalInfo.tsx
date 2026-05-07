export default function PersonalInfo({
  name, setName,
  email, setEmail,
  avatar, handleAvatarChange
}: any) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">

      <h2 className="font-semibold text-lg">Personal Information</h2>

      <div className="flex items-center gap-4">
        <img src={avatar} className="w-14 h-14 rounded-full object-cover border" />

        <label className="text-sm text-indigo-600 cursor-pointer">
          Change
          <input type="file" onChange={handleAvatarChange} className="hidden" />
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm text-gray-500">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-500">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 text-sm"
          />
        </div>
      </div>

    </div>
  )
}
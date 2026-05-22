type Props = {
  name: string
  setName: (v: string) => void
  email: string
  setEmail: (v: string) => void
  avatar: string | null
  initials: string
  handleAvatarChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void
}

export default function PersonalInfo({
  name,
  setName,
  email,
  setEmail,
  avatar,
  initials,
  handleAvatarChange
}: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200 dark:border-gray-700">

      <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-5">
        Personal Information
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">

        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover border-2 border-indigo-100"
          />
        ) : (
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold select-none">
            {initials}
          </div>
        )}

        <div>
          <label className="inline-flex cursor-pointer text-sm text-indigo-600 hover:text-indigo-500 font-medium">
            Change Avatar
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>

          <p className="text-xs text-gray-400 mt-1">
            JPG, PNG, or image file
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div>
          <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">
            Email
          </label>

          <input
            type="email"
            value={email}
            disabled
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-400 cursor-not-allowed"
          />
        </div>

      </div>

    </div>
  )
}
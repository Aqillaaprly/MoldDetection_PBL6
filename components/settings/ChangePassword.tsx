export default function ChangePassword({
  oldPassword, setOldPassword,
  newPassword, setNewPassword,
  confirmPassword, setConfirmPassword
}: any) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">

      <h2 className="font-semibold text-lg">Change Password</h2>

      <div className="grid md:grid-cols-3 gap-4">

        <div className="space-y-1">
          <label className="text-sm text-gray-500">Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl px-4 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-500">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl px-4 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-500">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl px-4 py-2 text-sm"
          />
        </div>

      </div>

    </div>
  )
}
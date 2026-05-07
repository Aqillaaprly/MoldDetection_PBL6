export default function ConnectedAccounts({ connectedAccounts }: any) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">

      <h2 className="font-semibold text-lg">Connected Accounts</h2>

      {connectedAccounts.map((acc: any, i: number) => (
        <div key={i} className="flex items-center justify-between border-b last:border-none pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold">
              G
            </div>
            <div>
              <p className="text-sm font-medium">{acc.name}</p>
              <p className="text-xs text-gray-400">
                Connected as {acc.email}
              </p>
            </div>
          </div>

          <button className="text-sm text-red-500 hover:underline">
            Disconnect
          </button>
        </div>
      ))}

    </div>
  )
}
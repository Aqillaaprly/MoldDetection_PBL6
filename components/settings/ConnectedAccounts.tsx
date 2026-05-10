const providerIcon: Record<string, string> = {
  google: "G",
  github: "GH",
  facebook: "F",
  email: "@",
}

const providerLabel: Record<string, string> = {
  google: "Google",
  github: "GitHub",
  facebook: "Facebook",
  email: "Email",
}

export interface ConnectedAccount {
  id: string
  provider: string
  email: string
}

export interface ConnectedAccountsProps {
  connectedAccounts: ConnectedAccount[]
}

export default function ConnectedAccounts({ connectedAccounts }: ConnectedAccountsProps) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
      <h2 className="font-semibold text-lg text-slate-800 dark:text-white">
        Connected Accounts
      </h2>

      {connectedAccounts.length === 0 ? (
        <p className="text-sm text-gray-400">No connected accounts.</p>
      ) : (
        connectedAccounts.map((acc: ConnectedAccount) => (
          <div
            key={acc.id}
            className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 last:border-none pb-3 last:pb-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                {providerIcon[acc.provider] ?? acc.provider[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-gray-200">
                  {providerLabel[acc.provider] ?? acc.provider}
                </p>
                <p className="text-xs text-gray-400">{acc.email}</p>
              </div>
            </div>

            <span className="text-xs text-green-500 font-medium">Connected</span>
          </div>
        ))
      )}
    </div>
  )
}
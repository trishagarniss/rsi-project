const placeholderRows = [
  {
    name: "Ayu Lestari",
    nisn: "0012345678",
    dropoutProbability: 0.78,
    riskLabel: "High",
  },
  {
    name: "Bima Pratama",
    nisn: "0012345679",
    dropoutProbability: 0.42,
    riskLabel: "Medium",
  },
  {
    name: "Citra Dewi",
    nisn: "0012345680",
    dropoutProbability: 0.12,
    riskLabel: "Low",
  },
] as const;

function riskBadgeClass(label: string) {
  switch (label) {
    case "High":
      return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200";
    case "Medium":
      return "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100";
    case "Low":
      return "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100";
    default:
      return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200";
  }
}

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Ringkasan prediksi risiko putus sekolah siswa (placeholder data).
        </p>
      </header>

      <section
        className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        aria-labelledby="risk-table-heading"
      >
        <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800 sm:px-6">
          <h3
            id="risk-table-heading"
            className="text-sm font-medium text-zinc-900 dark:text-zinc-50"
          >
            Student dropout risk
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Kolom akan diisi dari model ASGARD setelah integrasi API.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 text-left text-sm dark:divide-zinc-800">
            <thead className="bg-zinc-50 dark:bg-zinc-950/50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 font-medium text-zinc-700 sm:px-6 dark:text-zinc-300"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-medium text-zinc-700 sm:px-6 dark:text-zinc-300"
                >
                  NISN
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-medium text-zinc-700 sm:px-6 dark:text-zinc-300"
                >
                  Dropout Probability
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-medium text-zinc-700 sm:px-6 dark:text-zinc-300"
                >
                  Risk Label
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {placeholderRows.map((row) => (
                <tr
                  key={row.nisn}
                  className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-zinc-900 sm:px-6 dark:text-zinc-50">
                    {row.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-600 sm:px-6 dark:text-zinc-400">
                    {row.nisn}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums text-zinc-600 sm:px-6 dark:text-zinc-300">
                    {(row.dropoutProbability * 100).toFixed(1)}%
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 sm:px-6">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${riskBadgeClass(row.riskLabel)}`}
                    >
                      {row.riskLabel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default function UploadDataPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6 lg:p-8">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Upload Data
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Unggah CSV atau sumber data untuk pelatihan / skoring akan ditambahkan di sini.
        </p>
      </header>
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400">
        Placeholder — konten Upload Data.
      </div>
    </div>
  );
}

import { CounselorSidebar } from "@/components/bk/counselor-sidebar";

export default function CounselorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-0 flex-1">
      <CounselorSidebar />
      <div className="flex min-w-0 flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
        {children}
      </div>
    </div>
  );
}

import Link from 'next/link';

export function AuthShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between border-r border-line bg-surface p-12 lg:flex">
        <Link href="/" className="pl-[0.42em] font-display text-2xl font-bold uppercase tracking-logo">Cicero</Link>
        <div>
          <p className="eyebrow">Garment system // Control</p>
          <p className="display mt-4 text-7xl">Admin</p>
          <p className="mt-6 max-w-sm text-sm text-muted">Products, stock, orders, discounts and store settings — all in one place.</p>
        </div>
        <p className="font-display text-[11px] uppercase tracking-label text-subtle">Authorised staff only</p>
      </div>
      <div className="flex flex-col items-center justify-center px-4 py-16">
        <div className="mb-10 w-full max-w-[420px]">
          <p className="font-display text-xl font-bold uppercase tracking-logo lg:hidden">Cicero</p>
          <h1 className="display mt-6 text-4xl lg:mt-0">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}

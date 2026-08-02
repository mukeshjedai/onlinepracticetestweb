import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="max-w-md text-center">
        <h1 className="font-display text-4xl text-ink">Test not found</h1>
        <p className="mt-3 text-muted">That practice test doesn’t exist or was removed.</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}

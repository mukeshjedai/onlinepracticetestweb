import Link from "next/link";

const rows = [
  { feature: "Australia and its people", free: true, premium: true },
  { feature: "Democratic beliefs, rights & liberties", free: false, premium: true },
  { feature: "Government and the law", free: false, premium: true },
  { feature: "Australian values", free: false, premium: true },
  { feature: "Full mock exams", free: false, premium: "50 mock tests" },
  { feature: "Dashboard progress tracking", free: "With Google sign-in", premium: "With Google sign-in" },
  { feature: "One-time payment, no subscription", free: "—", premium: "AU$10.99" },
];

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm text-ink">{value}</span>;
  }
  return value ? (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-success/15 text-sm text-success">
      ✓
    </span>
  ) : (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-danger/10 text-sm text-danger">
      —
    </span>
  );
}

export function FreeVsPremium() {
  return (
    <section className="px-5 py-20 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="font-display text-3xl text-ink md:text-5xl">Free vs Premium access</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Free covers Australia and its people. Unlock every other section and all mock exams
            with one Premium payment.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[1.5rem] border border-line bg-surface shadow-sm">
          <div className="grid grid-cols-[1.4fr_1fr_1fr] bg-navy text-sm font-semibold text-white">
            <div className="px-4 py-4 md:px-6">Features</div>
            <div className="px-4 py-4 text-center md:px-6">Free</div>
            <div className="bg-gold/20 px-4 py-4 text-center text-gold-soft md:px-6">Premium</div>
          </div>
          {rows.map((row) => (
            <div
              key={row.feature}
              className="grid grid-cols-[1.4fr_1fr_1fr] border-t border-line items-center"
            >
              <div className="px-4 py-4 text-sm text-ink md:px-6">{row.feature}</div>
              <div className="flex justify-center px-4 py-4">
                <Cell value={row.free} />
              </div>
              <div className="flex justify-center bg-gold/[0.04] px-4 py-4">
                <Cell value={row.premium} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/premium"
            className="inline-flex rounded-full bg-gold px-6 py-3 text-sm font-bold text-navy transition hover:bg-gold-soft"
          >
            Unlock Premium — AU$10.99
          </Link>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <p className="font-display text-2xl">
            AussieCitizenship<span className="text-gold">Prep</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
            Free and premium Australian citizenship practice tests aligned with
            Our Common Bond — built to help you pass on the first try.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">
            Prepare
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            <li>
              <Link href="/#practice" className="hover:text-white">
                Free practice tests
              </Link>
            </li>
            <li>
              <Link href="/premium" className="hover:text-white">
                Premium package
              </Link>
            </li>
            <li>
              <a
                href="https://immi.homeaffairs.gov.au/citizenship/test-and-interview/our-common-bond"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                Our Common Bond booklet
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">
            Access
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            <li>Free forever starter tests</li>
            <li>Premium one-time unlock</li>
            <li>No subscription required</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-4 text-center text-xs text-white/50 md:px-8">
        © {new Date().getFullYear()} AussieCitizenshipPrep. Practice resource only — not affiliated with the Australian Government.
      </div>
    </footer>
  );
}

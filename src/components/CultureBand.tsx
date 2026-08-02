import Image from "next/image";

export function CultureBand() {
  return (
    <section className="overflow-hidden bg-surface px-5 py-16 md:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <div className="relative mx-auto aspect-square w-full max-w-md animate-drift">
          <Image
            src="/images/australia-culture.png"
            alt="Illustrated Australian landmarks, wildlife, and culture icons arranged around the word Australia"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 90vw, 420px"
          />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-harbour">
            Study the story of Australia
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
            From First Nations history to democratic values
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            The citizenship test covers Australia and its people, democratic beliefs,
            government and the law, and Australian values. Practise each area, then
            sit full mock exams until the format feels natural.
          </p>
          <a
            href="/#practice"
            className="mt-6 inline-flex rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-harbour"
          >
            Choose a practice area
          </a>
        </div>
      </div>
    </section>
  );
}

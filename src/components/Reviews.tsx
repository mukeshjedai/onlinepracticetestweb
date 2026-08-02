import { reviews } from "@/data/reviews";

export function Reviews() {
  return (
    <section id="reviews" className="bg-navy px-5 py-20 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">
            What test takers say
          </p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">
            Real passes. Real confidence.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <blockquote
              key={review.name}
              className="rounded-[1.4rem] border border-white/10 bg-white/5 p-6 animate-drift"
              style={{ animationDelay: `${index * 0.4}s` }}
            >
              <p className="text-sm leading-relaxed text-white/85">&ldquo;{review.quote}&rdquo;</p>
              <footer className="mt-5 flex items-center justify-between text-sm">
                <cite className="not-italic font-semibold text-gold-soft">— {review.name}</cite>
                <span className="rounded-full bg-gold/15 px-2.5 py-1 text-xs text-gold-soft">
                  {review.score}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

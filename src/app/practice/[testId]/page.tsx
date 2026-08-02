import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Footer } from "@/components/Footer";
import { QuizPlayer } from "@/components/QuizPlayer";
import { SiteHeader } from "@/components/SiteHeader";
import { getQuestionsForTest, getTestById } from "@/data/tests";
import { canAccessTest, isPremiumUser } from "@/lib/premium";

export default async function PracticeTestPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;
  const test = getTestById(testId);
  if (!test) notFound();

  const isPremium = await isPremiumUser();
  if (!canAccessTest(test.tier, isPremium)) {
    redirect("/premium");
  }

  const questions = getQuestionsForTest(test);

  return (
    <>
      <SiteHeader isPremium={isPremium} />
      <main className="section-band px-5 py-10 md:px-8 md:py-14">
        <div className="mx-auto mb-6 max-w-2xl">
          <Link href="/#practice" className="text-sm font-medium text-harbour">
            ← Back to practice tests
          </Link>
        </div>
        <QuizPlayer
          title={test.title}
          testId={test.id}
          category={test.category}
          questions={questions}
        />
      </main>
      <Footer />
    </>
  );
}

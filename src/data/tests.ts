import { categories, CategoryId, questions, Question } from "./questions";

export type AccessTier = "free" | "premium";

export type PracticeTest = {
  id: string;
  title: string;
  category: CategoryId | "full";
  questionCount: number;
  tier: AccessTier;
  description: string;
};

function pickQuestions(
  category: CategoryId | "full",
  count: number,
  seed: number,
): Question[] {
  const pool =
    category === "full"
      ? [...questions]
      : questions.filter((q) => q.category === category);

  const shuffled = [...pool].sort((a, b) => {
    const ha = ((a.id * 37 + seed * 17) % 97) - 48;
    const hb = ((b.id * 37 + seed * 17) % 97) - 48;
    return ha - hb;
  });

  const selected = shuffled.slice(0, Math.min(count, shuffled.length));
  // Repeat with offset if pool is smaller than requested (demo bank)
  while (selected.length < count && pool.length > 0) {
    selected.push(pool[selected.length % pool.length]);
  }
  return selected.map((q, i) => ({ ...q, id: q.id * 1000 + seed + i }));
}

/** Only Australia and its people is free. All other sections + full mocks are Premium. */
function sectionTests(category: CategoryId, count: number): PracticeTest[] {
  const meta = categories.find((c) => c.id === category)!;
  const tier: AccessTier = category === "people" ? "free" : "premium";
  return Array.from({ length: count }, (_, i) => ({
    id: `${category}-${tier}-${i + 1}`,
    title: `${meta.title} test ${i + 1}`,
    category,
    questionCount: 20,
    tier,
    description: `Focused practice for ${meta.title}.`,
  }));
}

const premiumFullTests: PracticeTest[] = Array.from({ length: 50 }, (_, i) => ({
  id: `mock-${i + 1}`,
  title: `Premium mock exam ${i + 1}`,
  category: "full" as const,
  questionCount: 20,
  tier: "premium" as const,
  description: "Full-length mock covering all four testable areas.",
}));

export const allTests: PracticeTest[] = [
  ...sectionTests("people", 5),
  ...sectionTests("democracy", 4),
  ...sectionTests("government", 6),
  ...sectionTests("values", 4),
  ...premiumFullTests,
];

export function getTestById(id: string): PracticeTest | undefined {
  return allTests.find((t) => t.id === id);
}

export function getQuestionsForTest(test: PracticeTest): Question[] {
  const seed = [...test.id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return pickQuestions(test.category, test.questionCount, seed);
}

export const pricing = {
  amountAud: 10.99,
  currency: "aud",
  label: "AU$ 10.99",
  tagline: "One-time purchase · No monthly fee · Unlimited practice",
};

export const freeSectionId: CategoryId = "people";

"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { PaymentProvider } from "@app/shared";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageLoader } from "@/components/ui/page-loader";
import { BuyBox } from "@/components/course/buy-box";
import { EnrolledBox } from "@/components/course/enrolled-box";
import { CurriculumPreview } from "@/components/course/curriculum-preview";
import { useCourse, useCheckout, useMyPurchases, useProgress } from "@/lib/queries";
import { useAuthStore } from "@/lib/auth-store";
import { useCurrency } from "@/lib/use-currency";
import { getErrorMessage } from "@/lib/api";

export default function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();

  const { data: course, isLoading: courseLoading } = useCourse(slug, true);
  const checkout = useCheckout();
  const { user, hydrated } = useAuthStore();

  // Only fetch purchases and progress if logged in
  const { data: purchases } = useMyPurchases();
  const purchase = course
    ? (purchases ?? []).find((p) => p.courseId === course.id && p.status === "ACTIVE")
    : undefined;
  const { data: progress } = useProgress(course?.id ?? "", !!purchase);

  const { currency, setCurrency, providers, defaultProvider } = useCurrency();
  const [provider, setProvider] = useState<PaymentProvider>(defaultProvider);
  const [error, setError] = useState("");

  useEffect(() => {
    setProvider(defaultProvider);
  }, [defaultProvider]);

  async function handleBuy() {
    setError("");
    if (hydrated && !user) {
      router.push(`/login?redirect=/courses/${slug}`);
      return;
    }
    if (!course) return;
    try {
      const session = await checkout.mutateAsync({ courseId: course.id, provider, currency });
      window.location.href = session.url;
    } catch (e) {
      setError(getErrorMessage(e));
    }
  }

  if (courseLoading || !course) return <PageLoader fullScreen />;

  const completedIds = new Set(progress?.completedLessonIds ?? []);
  const enrolled = !!purchase;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold sm:text-4xl">{course.title}</h1>
            <p className="mt-3 text-lg text-ink-200">{course.subtitle}</p>
            <p className="mt-6 text-ink-100">{course.description}</p>
            <CurriculumPreview
              course={course}
              enrolled={enrolled}
              completedIds={completedIds}
              onSelectLesson={(lessonId) =>
                router.push(`/dashboard/courses/${course.id}?lesson=${lessonId}`)
              }
            />
          </div>

          <div className="lg:col-span-1">
            {enrolled ? (
              <EnrolledBox
                coverImage={course.coverImage}
                title={course.title}
                progress={progress ?? null}
                courseId={course.id}
              />
            ) : (
              <BuyBox
                coverImage={course.coverImage}
                title={course.title}
                priceCents={course.priceCents}
                priceArs={course.priceArs}
                currency={currency}
                onCurrencyChange={setCurrency}
                providers={providers}
                selectedProvider={provider}
                onProviderChange={setProvider}
                onBuy={handleBuy}
                isPending={checkout.isPending}
                error={error}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

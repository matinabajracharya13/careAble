'use client';

import { useEffect, useState } from 'react';

import { CategorySidebar } from '@/components/onboarding/CategorySidebar';
import { LivePreview } from '@/components/onboarding/LivePreview';
import { QuestionCanvas } from '@/components/onboarding/QuestionCanvas';
import { useOnboardingCategories, useOnboardingQuestions } from '@/hooks/use-onboarding';
import { useParams } from 'react-router-dom';

export function OnboardingBuilderPage() {
  const { id } = useParams();
  const { data: categoriesData } = useOnboardingCategories(Number(id));
  const categories = categoriesData?.data ?? [];
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(categories?.[0]?.category_id ?? null);
  const [questionsState, setQuestionsState] = useState([]);

  const { data: questionsData } = useOnboardingQuestions(activeCategoryId as number);
  const questions = questionsData?.data ?? [];

  console.log('Questions Data:', questionsData); // Debug log to check the structure of questionsData
  useEffect(() => {
    setQuestionsState(questions);
  }, [questions]);

  return (
    <div className='h-screen grid grid-cols-12 gap-4 p-4'>
      {/* LEFT */}
      <div className='col-span-3 border rounded-md p-2'>
        <CategorySidebar
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelect={setActiveCategoryId}
        />
      </div>

      {/* CENTER */}
      <div className='col-span-6 border rounded-md p-3'>
        <QuestionCanvas
          categoryId={activeCategoryId}
          questions={questionsState}
          setQuestions={setQuestionsState}
        />
      </div>

      {/* RIGHT */}
      <div className='col-span-3 border rounded-md p-2'>
        <LivePreview questions={questionsState} />
      </div>
    </div>
  );
}

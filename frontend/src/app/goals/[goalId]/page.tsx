import { GoalDetailPageClient } from "@/components/goal-detail-page-client";

interface GoalDetailPageProps {
  params: Promise<{
    goalId: string;
  }>;
}

export default async function GoalDetailPage({ params }: GoalDetailPageProps) {
  const { goalId } = await params;

  return <GoalDetailPageClient goalId={goalId} />;
}

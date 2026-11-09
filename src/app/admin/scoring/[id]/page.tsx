import { AdminScoringPage } from "@/modules/frontend";

export default function Page({ params }: { params: { id: string } }) {
  return <AdminScoringPage matchId={params.id} />;
}


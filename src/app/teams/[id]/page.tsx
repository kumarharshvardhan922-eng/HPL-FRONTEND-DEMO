import { PublicLayout, TeamDetailPage } from "@/modules/frontend";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <PublicLayout>
      <TeamDetailPage teamId={params.id} />
    </PublicLayout>
  );
}


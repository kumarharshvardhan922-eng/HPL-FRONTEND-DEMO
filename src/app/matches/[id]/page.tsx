import { MatchPage, PublicLayout } from "@/modules/frontend";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <PublicLayout>
      <MatchPage matchId={params.id} />
    </PublicLayout>
  );
}


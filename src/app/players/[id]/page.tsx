import { PlayerDetailPage, PublicLayout } from "@/modules/frontend";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <PublicLayout>
      <PlayerDetailPage playerId={params.id} />
    </PublicLayout>
  );
}


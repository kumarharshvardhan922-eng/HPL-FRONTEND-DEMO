import { SportId } from "@/modules/frontend/types";
import { PublicLayout, SportPage } from "@/modules/frontend";

export default function Page({ params }: { params: { sport: string } }) {
  return (
    <PublicLayout>
      <SportPage sportId={params.sport as SportId} />
    </PublicLayout>
  );
}


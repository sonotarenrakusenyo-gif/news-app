import { HomeClient } from "@/components/HomeClient";
import { genres } from "@/lib/sources";
import { loadStore, sortNewsItems } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const store = await loadStore();
  const items = sortNewsItems(store.items);

  return <HomeClient genres={genres} items={items} />;
}

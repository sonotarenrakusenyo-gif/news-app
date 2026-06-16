import { HomeClient } from "@/components/HomeClient";
import {
  genres,
  getRegisteredAccountHandles,
  normalizeHandle,
} from "@/lib/sources";
import { loadStore, sortNewsItems } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const store = await loadStore();
  const registeredHandles = getRegisteredAccountHandles();
  const items = sortNewsItems(store.items).filter((item) =>
    registeredHandles.has(normalizeHandle(item.handle)),
  );

  return <HomeClient genres={genres} items={items} />;
}

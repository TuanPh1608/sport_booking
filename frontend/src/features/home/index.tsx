import { HomeFeatures } from "@/features/home/components/home-features";
import { HomeHero } from "@/features/home/components/home-hero";

export function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <HomeHero />
      <HomeFeatures />
    </main>
  );
}

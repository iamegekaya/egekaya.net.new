import HomeProfileCard from "@/components/profile/home-profile-card";

export default function HomePage() {
  return (
    <main className="home-main relative z-[1] grid min-h-[100svh] place-items-center px-4 py-20 sm:px-6 md:min-h-screen md:pt-28 md:pb-10">
      <HomeProfileCard />
    </main>
  );
}

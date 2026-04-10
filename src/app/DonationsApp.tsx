import { DonationSection } from "./components/DonationSection";

export default function DonationsApp() {
  return (
    <main className="min-h-screen bg-[#FFF8E8] px-4 py-8 md:py-12">
      <div className="mx-auto max-w-5xl pt-20">
        <DonationSection />
      </div>
    </main>
  );
}

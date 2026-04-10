import { useState } from "react";
import { ArrowLeft, LogOut } from "lucide-react";
import { AdminPanel } from "./components/AdminPanel";
import { AdminLogin } from "./components/AdminLogin";
import { ChurchContentProvider } from "./content/ChurchContentContext";
import { clearAdminSession, getAdminSession } from "./lib/adminAuth";

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => getAdminSession()?.authenticated ?? false,
  );

  if (!isAuthenticated) {
    return <AdminLogin onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <ChurchContentProvider>
      <div className="min-h-screen bg-[#FFF8E8]">
        <div className="px-4 pt-4 sm:px-5 md:pt-6">
          <div className="mx-auto max-w-7xl rounded-[36px] border border-[#1C2526]/8 bg-white/92 px-5 py-6 shadow-[0_24px_70px_rgba(28,37,38,0.12)] backdrop-blur-xl md:px-7 md:py-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="inline-flex rounded-full bg-[#FFF4E8] px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#FF6B00]">
                   Admin Portal
                </p>
                <h1 className="mt-4 text-3xl text-[#1C2526] md:text-4xl">
                  In His Name Bible Church Content Studio
                </h1>
                <p className="mt-3 text-[#1C2526]/65">
                  Update public website cards, expand longer details for each
                  ministry, sermon, and event, and control what visitors can
                  open on the main site.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="./"
                  className="inline-flex items-center gap-2 rounded-full border border-[#1C2526]/10 bg-[#FFF8E8] px-5 py-3 text-sm font-medium text-[#1C2526] transition-colors hover:border-[#FF6B00]/40 hover:text-[#FF6B00]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Website
                </a>

                <button
                  type="button"
                  onClick={() => {
                    clearAdminSession();
                    setIsAuthenticated(false);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-[#1C2526]/10 bg-white px-5 py-3 text-sm font-medium text-[#1C2526] transition-colors hover:border-[#B91C1C]/40 hover:text-[#B91C1C]"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>

        <AdminPanel />
      </div>
    </ChurchContentProvider>
  );
}

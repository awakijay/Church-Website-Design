import { FormEvent, useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import {
  authenticateAdmin,
  getAdminCredentialHint,
} from "../lib/adminAuth";

type AdminLoginProps = {
  onAuthenticated: () => void;
};

export function AdminLogin({ onAuthenticated }: AdminLoginProps) {
  const credentialHint = getAdminCredentialHint();
  const [username, setUsername] = useState(credentialHint.username);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isAuthenticated = authenticateAdmin(username, password);

    if (!isAuthenticated) {
      setError("Incorrect username or password.");
      return;
    }

    setError("");
    onAuthenticated();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF8E8] px-4 py-12">
      <div className="w-full max-w-md rounded-[32px] border border-[#1C2526]/10 bg-white p-8 text-[#1C2526] shadow-[0_24px_80px_rgba(28,37,38,0.16)]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FF6B00]/10 text-[#FF6B00]">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-[#FF6B00]">
            Secure Access
          </p>
          <h1 className="mt-3 text-3xl">Admin Portal Login</h1>
          <p className="mt-3 text-sm leading-6 text-[#1C2526]/70">
            Sign in to manage sermons, ministries, and events for the website.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="grid gap-2">
            <span className="text-sm text-[#1C2526]/70">Username</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="rounded-2xl border border-[#1C2526]/15 bg-[#FFF8E8] px-4 py-3 outline-none transition-colors focus:border-[#FF6B00]"
              autoComplete="username"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-[#1C2526]/70">Password</span>
            <div className="flex items-center rounded-2xl border border-[#1C2526]/15 bg-[#FFF8E8] px-4 focus-within:border-[#FF6B00]">
              <LockKeyhole className="h-4 w-4 text-[#1C2526]/45" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-transparent px-3 py-3 outline-none"
                autoComplete="current-password"
              />
            </div>
          </label>

          {error ? (
            <p className="rounded-2xl border border-[#B91C1C]/15 bg-[#B91C1C]/8 px-4 py-3 text-sm text-[#B91C1C]">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#FF6B00] px-6 py-3 font-medium text-white transition-colors hover:bg-[#FF6B00]/90"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-[#1C2526]/10 bg-[#FFF8E8] px-4 py-4 text-sm text-[#1C2526]/70">
          {/* <p>Username: {credentialHint.username}</p> */}
          {/* <p className="mt-1">
            {credentialHint.isUsingDefaultPassword
              ? "The portal is using a development password right now. Set VITE_ADMIN_PASSWORD before production."
              : "Password is being provided through environment configuration."}
          </p> */}
        </div>
      </div>
    </main>
  );
}

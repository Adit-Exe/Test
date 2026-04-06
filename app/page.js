"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userRecord, setUserRecord] = useState(null);
  const router = useRouter();

  const handleNext = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { data, error: sbError } = await supabase
        .from("First")
        .select("*")
        .eq("name", username.trim())
        .maybeSingle();

      if (sbError) throw sbError;

      if (!data) {
        setError("wrong username");
      } else {
        setUserRecord(data);
        setStep(2);
      }
    } catch (err) {
      console.error(err);
      setError("wrong username");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter a password");
      return;
    }

    if (password !== userRecord.password) {
      setError("wrong password");
      return;
    }

    // Redirect to dashboard, passing the id and name
    router.push(`/dashboard?id=${userRecord.id}&name=${encodeURIComponent(userRecord.name)}`);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 text-zinc-900 selection:bg-zinc-200 overflow-hidden relative">

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-10 bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col justify-center transition-all duration-500">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-zinc-900 mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-zinc-500 text-sm">
            {step === 1 ? "Enter your username to continue" : "Enter your password"}
          </p>
        </div>

        {/* Forms */}
        <div className="relative w-full">
          {/* Step 1: Username */}
          <form
            onSubmit={handleNext}
            className={`transition-all duration-500 ease-in-out absolute w-full top-0 left-0 ${step === 1 ? 'opacity-100 translate-x-0 pointer-events-auto relative' : 'opacity-0 -translate-x-10 pointer-events-none'}`}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all font-medium"
                  placeholder="Enter your username"
                  autoFocus
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg border border-red-100 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3.5 px-4 rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-6 flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Continue
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Step 2: Password */}
          <form
            onSubmit={handleLogin}
            className={`transition-all duration-500 ease-in-out absolute w-full top-0 left-0 ${step === 2 ? 'opacity-100 translate-x-0 pointer-events-auto relative' : 'opacity-0 translate-x-10 pointer-events-none'}`}
          >
            <div className="space-y-4">
              {/* Back button user summary */}
              <button
                type="button"
                onClick={() => { setStep(1); setPassword(""); setError(""); }}
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors mb-4 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Not {username}?
              </button>

              <div>
                <div className="flex items-center gap-3 mb-6 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                  <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-600 font-semibold text-lg">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div className="font-semibold text-zinc-900">{username}</div>
                </div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all font-medium"
                  placeholder="Enter your password"
                  autoFocus={step === 2}
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg border border-red-100 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3.5 px-4 rounded-xl shadow-sm transition-all active:scale-[0.98] mt-6 flex justify-center items-center gap-2"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

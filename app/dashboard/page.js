"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function DashboardContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const id = searchParams.get("id");
    const fallbackName = searchParams.get("name") || "";

    const [name, setName] = useState(fallbackName);
    const [songs, setSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) {
            router.push("/");
            return;
        }

        async function fetchData() {
            try {
                // Fetch User Details to ensure we have the exact name
                const { data: userRecord, error: userError } = await supabase
                    .from("First")
                    .select("name")
                    .eq("id", id)
                    .maybeSingle();

                if (userError) throw userError;
                if (!userRecord) {
                    router.push("/");
                    return;
                }

                const exactName = userRecord.name;
                setName(exactName);

                // Fetch Songs from Second table based on `artist_name`
                const { data: songsData, error: songsError } = await supabase
                    .from("Second")
                    .select("*")
                    .eq("artist_name", exactName);

                if (songsError) throw songsError;
                setSongs(songsData || []);
            } catch (err) {
                console.error(err);
                setError("Failed to load data.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [id, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans p-6 sm:p-12 md:p-24 selection:bg-zinc-200">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <p className="text-zinc-400 uppercase tracking-widest text-xs font-semibold mb-1">Artist Profile</p>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">
                            {name}
                        </h1>
                    </div>
                    <button
                        onClick={() => router.push("/")}
                        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors bg-white hover:bg-zinc-100 px-4 py-2 rounded-lg border border-zinc-200 shadow-sm"
                    >
                        Sign Out
                    </button>
                </header>

                {error ? (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-2xl shadow-sm">
                        {error}
                    </div>
                ) : (
                    <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-zinc-200 text-xs tracking-widest uppercase text-zinc-500 bg-zinc-50/50">
                                        <th className="px-6 py-4 font-semibold">Artist</th>
                                        <th className="px-6 py-4 font-semibold">Song Name</th>
                                        <th className="px-6 py-4 font-semibold text-right">YouTube</th>
                                        <th className="px-6 py-4 font-semibold text-right">Spotify</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {songs.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                                                No songs found for this artist.
                                            </td>
                                        </tr>
                                    ) : (
                                        songs.map((song, idx) => (
                                            <tr
                                                key={song.artist_id || idx}
                                                className="group hover:bg-zinc-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 font-medium text-zinc-500">
                                                    {song.artist_name}
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-zinc-900 whitespace-nowrap">
                                                    {song.song}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {song.youtube !== undefined && song.youtube !== null ? (
                                                        <span className="inline-flex items-center gap-1.5 text-zinc-700 bg-white border border-zinc-100 shadow-sm px-2.5 py-1 rounded-md text-sm font-medium">
                                                            <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                            </svg>
                                                            {typeof song.youtube === 'number' ? song.youtube.toLocaleString() : song.youtube}
                                                        </span>
                                                    ) : (
                                                        <span className="text-zinc-400 text-sm">--</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {song.spotify !== undefined && song.spotify !== null ? (
                                                        <span className="inline-flex items-center gap-1.5 text-zinc-700 bg-white border border-zinc-100 shadow-sm px-2.5 py-1 rounded-md text-sm font-medium">
                                                            <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zM20.16 9.6C15.84 7.08 9.12 6.9 5.28 8.1c-.6.18-1.2-.12-1.38-.66-.18-.6.12-1.2.66-1.38C9.12 4.68 16.44 4.92 21.36 7.8c.54.3.72.96.42 1.5-.24.48-.9.66-1.62.3z" />
                                                            </svg>
                                                            {typeof song.spotify === 'number' ? song.spotify.toLocaleString() : song.spotify}
                                                        </span>
                                                    ) : (
                                                        <span className="text-zinc-400 text-sm">--</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Dashboard() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}

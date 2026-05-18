"use client";

import {
    use,
    useEffect,
    useState,
} from "react";

import Image from "next/image";
import Link from "next/link";

import {
    Pencil,
    Trash2,
    ArrowLeft,
    CalendarDays,
    Layers3,
} from "lucide-react";

import API from "@/lib/axios";

import {
    useRouter,
} from "next/navigation";

export default function TournamentDetailsPage({
    params,
}) {

    const router =
        useRouter();

    const { id } =
        use(params);

    const [stats, setStats] =
        useState(null);

    const [deleteModal,
        setDeleteModal] =
        useState(false);

    const [tournament,
        setTournament] =
        useState(null);

    const [loading,
        setLoading] =
        useState(true);

    useEffect(() => {

        if (!id) return;

        fetchTournament();

    }, [id]);

    const handleDelete =
        async () => {

            try {

                await API.delete(
                    `/tournaments/${id}`
                );

                router.push(
                    "/admin/tournaments"
                );

            } catch (error) {

                console.log(
                    "Delete error:",
                    error?.response?.status,
                    error?.response?.data,
                    error
                );

            }

        };

    const fetchTournament =
        async () => {

            if (!id) return;

            try {

                const res =
                    await API.get(
                        `/tournaments/${id}`
                    );

                setTournament(
                    res.data.data.tournament
                );

                setStats(
                    res.data.data.stats
                );

            } catch (error) {

                console.log(
                    "Tournament fetch error:",
                    error?.response?.status,
                    error?.response?.data,
                    error
                );

            } finally {

                setLoading(false);

            }

        };

    if (loading || !tournament) {

        return (

            <div className="min-h-[70vh] flex items-center justify-center">

                <div className="h-20 w-20 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />

            </div>

        );

    }

    return (

        <div className="space-y-10">

            <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-8">

                {/* LEFT */}

                <div className="space-y-5">

                    <Link
                        href="/admin/tournaments"
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-gray-300 transition hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-white"
                    >

                        <ArrowLeft size={18} />

                        Back to Tournaments

                    </Link>

                    <div className="relative aspect-square overflow-hidden rounded-3xl border border-purple-500/20">

                        <Image
                            src={tournament.banner}
                            alt={tournament.name}
                            fill
                            priority
                            sizes="320px"
                            className="object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                    </div>

                </div>

                {/* RIGHT */}

                <div className="rounded-3xl border border-purple-500/20 bg-white/[0.03] p-8">

                    <div className="flex items-start justify-between gap-4">

                        <div>

                            <p className="uppercase tracking-[0.3em] text-sm text-purple-400">
                                {tournament.game}
                            </p>

                        </div>

                        <div className="flex items-center gap-3">

                            <button
                                onClick={() => {
                                    if (id) router.push(`/admin/tournaments/${id}/edit`);
                                }}
                                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 px-5 py-3 text-sm font-bold text-white transition hover:scale-105"
                            >

                                <Pencil size={16} />

                                Edit

                            </button>

                            <button
                                onClick={() =>
                                    setDeleteModal(
                                        true
                                    )
                                }
                                className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-bold text-red-400 transition hover:bg-red-500/20"
                            >

                                <Trash2 size={16} />

                                Delete

                            </button>

                        </div>

                    </div>

                    <h1 className="mt-4 text-5xl font-black text-white">
                        {tournament.name}
                    </h1>

                    <p className="mt-5 max-w-3xl text-gray-400 leading-relaxed">
                        Competitive esports tournament dashboard
                        with rounds, groups, match management
                        and leaderboard systems.
                    </p>

                    {/* STATS */}

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                        <div className="rounded-3xl border border-purple-500/20 bg-white/[0.03] p-8">

                            <h2 className="text-5xl font-black text-white">
                                {stats?.totalTeams || 0}
                            </h2>

                            <p className="mt-3 text-gray-400">
                                Total Teams
                            </p>

                        </div>

                        <div className="rounded-3xl border border-green-500/20 bg-white/[0.03] p-8">

                            <h2 className="text-5xl font-black text-white">
                                {stats?.verifiedTeams || 0}
                            </h2>

                            <p className="mt-3 text-gray-400">
                                Verified Teams
                            </p>

                        </div>

                        <div className="rounded-3xl border border-yellow-500/20 bg-white/[0.03] p-8">

                            <h2 className="text-5xl font-black text-white">
                                {stats?.pendingTeams || 0}
                            </h2>

                            <p className="mt-3 text-gray-400">
                                Pending Teams
                            </p>

                        </div>

                        <div className="rounded-3xl border border-cyan-500/20 bg-white/[0.03] p-8">

                            <h2 className="text-5xl font-black text-white">
                                {stats?.totalRounds || 0}
                            </h2>

                            <p className="mt-3 text-gray-400">
                                Tournament Rounds
                            </p>

                        </div>

                    </div>

                    {/* FOOTER */}

                    <div className="mt-8 flex flex-wrap items-center gap-6 text-gray-400">

                        <div className="flex items-center gap-2">

                            <CalendarDays size={18} />

                            <span>
                                {
                                    new Date(
                                        tournament.startDate
                                    ).toLocaleDateString()
                                }
                            </span>

                        </div>

                        <div className="flex items-center gap-2">

                            <Layers3 size={18} />

                            <span>
                                {
                                    tournament.rounds.length
                                }
                                {" "}
                                Rounds
                            </span>

                        </div>

                    </div>

                </div>

            </div>

            {/* ACTIONS */}

            <div className="mt-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex flex-wrap gap-5">

                    {/* 1. Added conditional check: Only render links if id is ready */}
                    {id && (
                        <>
                            <Link
                                href={`/admin/tournaments/${id}/pending-teams`}
                                className="inline-flex items-center gap-3 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-6 py-4 font-bold text-yellow-400 transition hover:bg-yellow-500/20"
                            >
                                Pending Teams ({stats?.pendingTeams || 0})
                            </Link>

                            <Link
                                href={`/admin/tournaments/${id}/teams`}
                                className="inline-flex items-center gap-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-6 py-4 font-bold text-cyan-400 transition hover:bg-cyan-500/20"
                            >
                                All Teams ({stats?.totalTeams || 0})
                            </Link>

                            <Link
                                href={`/admin/tournaments/${id}/rounds`}
                                className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-4 font-bold text-white transition hover:scale-105"
                            >
                                Manage Rounds
                            </Link>
                        </>
                    )}

                </div>

                <div className="lg:text-right">
                    <p className="uppercase tracking-[0.25em] text-xs text-gray-400">
                        Tournament Status
                    </p>
                    <div
                        className={`mt-3 inline-flex rounded-2xl px-5 py-3 text-sm font-bold
            ${tournament.status === "registration-open"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : tournament.status === "ongoing"
                                    ? "bg-cyan-500/20 text-cyan-400"
                                    : tournament.status === "completed"
                                        ? "bg-red-500/20 text-red-400"
                                        : "bg-yellow-500/20 text-yellow-400"
                            }`}
                    >
                        {tournament.status}
                    </div>
                </div>

            </div>

            {
                deleteModal && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

                        <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-[#0f0f0f] p-8 shadow-[0_0_60px_rgba(239,68,68,0.2)]">

                            <h2 className="text-3xl font-black text-white">
                                Delete Tournament
                            </h2>

                            <p className="mt-4 text-gray-400 leading-relaxed">

                                Are you sure you want to delete

                                <span className="mx-2 font-bold text-red-400">
                                    {tournament.name}
                                </span>

                                ?

                            </p>

                            <div className="mt-8 flex gap-4">

                                <button
                                    onClick={() =>
                                        setDeleteModal(
                                            false
                                        )
                                    }
                                    className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-semibold text-white transition hover:bg-white/10"
                                >

                                    Cancel

                                </button>

                                <button
                                    onClick={
                                        handleDelete
                                    }
                                    className="flex-1 rounded-2xl bg-red-500 px-5 py-4 font-bold text-white transition hover:bg-red-400"
                                >

                                    Delete

                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

        </div>

    );

}
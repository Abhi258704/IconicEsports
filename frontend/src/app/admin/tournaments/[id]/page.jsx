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
    Trophy,
    CalendarDays,
    Users,
    Layers3,
} from "lucide-react";

import API from "@/lib/axios";
import { useRouter }
    from "next/navigation";

export default function TournamentDetailsPage({
    params,
}) {

    const router = useRouter();

    const { id } = use(params);

    const [deleteModal, setDeleteModal] =
        useState(false);

    const [tournament, setTournament] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [groups, setGroups] =
        useState([]);

    const [pendingTeams,
        setPendingTeams] =
        useState([]);

    useEffect(() => {

        fetchTournament();

        fetchTeamsData();

    }, []);

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

                console.log(error);

            }

        };

    const fetchTournament =
        async () => {

            try {

                const res =
                    await API.get(
                        `/tournaments/${id}`
                    );

                setTournament(
                    res.data.data
                );

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        };

    const fetchTeamsData =
        async () => {

            try {

                const res =
                    await API.get(
                        `/tournaments/${id}/teams-data`
                    );

                setGroups(
                    res.data.data.groups
                );

                setPendingTeams(
                    res.data.data.pendingTeams
                );

            } catch (error) {

                console.log(error);

            }

        };

    if (loading) {

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

                    {/* BACK BUTTON */}

                    <Link
                        href="/admin/tournaments"
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-gray-300 transition hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-white"
                    >

                        <ArrowLeft size={18} />

                        Back to Tournaments

                    </Link>

                    {/* BANNER */}

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

                        {/* ACTIONS */}

                        <div className="flex items-center gap-3">

                            {/* EDIT */}

                            <button
                                onClick={() =>
                                    router.push(
                                        `/admin/tournaments/${id}/edit`
                                    )
                                }
                                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 px-5 py-3 text-sm font-bold text-white transition hover:scale-105"
                            >

                                <Pencil size={16} />

                                Edit

                            </button>

                            {/* DELETE */}

                            <button
                                onClick={() =>
                                    setDeleteModal(true)
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

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">

                        <div className="rounded-2xl border border-purple-500/20 bg-black/30 p-5">

                            <p className="text-sm text-gray-400">
                                Prize Pool
                            </p>

                            <h2 className="mt-3 text-3xl font-black text-white">
                                ₹{tournament.prizePool}
                            </h2>

                        </div>

                        <div className="rounded-2xl border border-cyan-500/20 bg-black/30 p-5">

                            <p className="text-sm text-gray-400">
                                Entry Fee
                            </p>

                            <h2 className="mt-3 text-3xl font-black text-white">
                                ₹{tournament.entryFee}
                            </h2>

                        </div>

                        <div className="rounded-2xl border border-pink-500/20 bg-black/30 p-5">

                            <p className="text-sm text-gray-400">
                                Team Capacity
                            </p>

                            <h2 className="mt-3 text-3xl font-black text-white">
                                {tournament.maxTeams}
                            </h2>

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
                                {tournament.rounds.length} Rounds
                            </span>

                        </div>

                    </div>

                </div>

            </div>

            {/* ROUND MANAGEMENT */}

            <div className="mt-10 flex gap-4">

                <Link
                    href={`/admin/tournaments/${id}/rounds`}
                    className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-4 font-bold text-white transition hover:scale-105"
                >

                    <Layers3 size={20} />

                    Manage Rounds

                </Link>

                 <Link
                    href={`/admin/tournaments/${id}/pending-teams`}
                    className="inline-flex items-center gap-3 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-6 py-4 font-bold text-yellow-400 transition hover:bg-yellow-500/20"
                >

                    Pending Teams
                    ({pendingTeams.length})

                </Link>

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
                                        setDeleteModal(false)
                                    }
                                    className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-semibold text-white transition hover:bg-white/10"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleDelete}
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
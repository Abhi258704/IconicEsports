"use client";

import {
    useEffect,
    useState,
} from "react";

import Link from "next/link";

import Image from "next/image";

import {
    Trophy,
    CalendarDays,
    Trash2,
    Plus,
} from "lucide-react";

import API from "@/lib/axios";

export default function TournamentsPage() {

    const [deleteModal, setDeleteModal] =
        useState(false);

    const [selectedTournament, setSelectedTournament] =
        useState(null);

    const [tournaments, setTournaments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        fetchTournaments();

    }, []);

    const fetchTournaments =
        async () => {

            try {

                const res =
                    await API.get(
                        "/tournaments"
                    );

                setTournaments(
                    res.data.data
                );

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        };

    const deleteTournament =
        async () => {

            if (!selectedTournament)
                return;

            try {

                await API.delete(
                    `/tournaments/${selectedTournament._id}`
                );

                setTournaments((prev) =>
                    prev.filter(
                        (tournament) =>
                            tournament._id !==
                            selectedTournament._id
                    )
                );

                setDeleteModal(false);

                setSelectedTournament(null);

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

            {/* HEADER */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div>

                    <p className="uppercase tracking-[0.3em] text-sm text-purple-400">
                        Tournament Management
                    </p>

                    <h1 className="mt-3 text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                        Tournaments
                    </h1>

                </div>

                <Link
                    href="/admin/tournaments/create"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-4 font-bold text-black transition hover:scale-105"
                >

                    <Plus size={20} />

                    Create Tournament

                </Link>

            </div>

            {/* EMPTY */}

            {tournaments.length === 0 && (

                <div className="rounded-3xl border border-purple-500/20 bg-white/[0.03] p-16 text-center">

                    <Trophy
                        size={70}
                        className="mx-auto text-purple-400"
                    />

                    <h2 className="mt-6 text-3xl font-black text-white">
                        No Tournaments Yet
                    </h2>

                    <p className="mt-3 text-gray-400">
                        Create your first esports tournament.
                    </p>

                </div>

            )}

            {/* GRID */}

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">

                {tournaments.map(
                    (tournament) => (

                        <div
                            key={tournament._id}
                            className="group overflow-hidden rounded-3xl border border-purple-500/20 bg-white/[0.03] backdrop-blur-xl transition hover:-translate-y-1 hover:border-purple-500/40"
                        >

                            {/* BANNER */}

                            <div className="relative h-52 overflow-hidden">

                                <Image
                                    src={tournament.banner}
                                    alt={tournament.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw,
                                            (max-width: 1200px) 50vw,
                                            33vw"
                                    priority
                                    className="object-cover transition duration-500 group-hover:scale-105"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                            </div>

                            {/* CONTENT */}

                            <div className="p-6">

                                <div className="flex items-start justify-between gap-4">

                                    <div>

                                        <p className="text-xs uppercase tracking-[0.25em] text-purple-400">
                                            {tournament.game}
                                        </p>

                                        <h2 className="mt-2 text-3xl font-black text-white">
                                            {tournament.name}
                                        </h2>

                                    </div>

                                    <button
                                        onClick={() => {

                                            setSelectedTournament(
                                                tournament
                                            );

                                            setDeleteModal(true);

                                        }}
                                        className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-red-400 transition hover:bg-red-500/20"
                                    >

                                        <Trash2 size={18} />

                                    </button>

                                </div>

                                <div className="mt-6 space-y-4">

                                    <div className="flex items-center justify-between">

                                        <span className="text-gray-400">
                                            Prize Pool
                                        </span>

                                        <span className="font-bold text-white">
                                            ₹{tournament.prizePool}
                                        </span>

                                    </div>

                                    <div className="flex items-center justify-between">

                                        <span className="text-gray-400">
                                            Entry Fee
                                        </span>

                                        <span className="font-bold text-white">
                                            ₹{tournament.entryFee}
                                        </span>

                                    </div>

                                    <div className="flex items-center justify-between">

                                        <span className="text-gray-400">
                                            Max Teams
                                        </span>

                                        <span className="font-bold text-white">
                                            {tournament.maxTeams}
                                        </span>

                                    </div>

                                    <div className="flex items-center gap-2 text-gray-400 pt-2">

                                        <CalendarDays size={18} />

                                        <span>
                                            {new Date(
                                                tournament.startDate
                                            ).toLocaleDateString()}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>

                    )
                )}

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
                                    {selectedTournament?.name}
                                </span>

                                ?

                            </p>

                            <div className="mt-8 flex gap-4">

                                <button
                                    onClick={() => {

                                        setDeleteModal(false);

                                        setSelectedTournament(null);

                                    }}
                                    className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-semibold text-white transition hover:bg-white/10"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={deleteTournament}
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
"use client";

import {
    use,
    useEffect,
    useState,
} from "react";

import Link from "next/link";

import {
    ArrowLeft,
    Users,
    ShieldCheck,
} from "lucide-react";

import API from "@/lib/axios";

export default function TeamDetailsPage({
    params,
}) {

    const { teamId } =
        use(params);

    const [team, setTeam] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        fetchTeam();

    }, []);

    const fetchTeam =
        async () => {

            try {

                const res =
                    await API.get(
                        `/teams/${teamId}`
                    );

                setTeam(
                    res.data.data
                );

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        };

    if (loading) {

        return (

            <div className="min-h-[70vh] flex items-center justify-center">

                <div className="h-20 w-20 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />

            </div>

        );

    }

    if (!team) {

        return (

            <div className="min-h-[70vh] flex items-center justify-center text-white">

                Team not found

            </div>

        );

    }

    return (

        <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden">

            {/* HEADER */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div>

                    <Link
                        href={`/admin/tournaments/${typeof team.tournament ===
                            "object"

                            ? team.tournament._id

                            : team.tournament
                            }/teams`}
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-gray-300 transition hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-white"
                    >

                        <ArrowLeft size={18} />

                        Back

                    </Link>

                    <p className="mt-6 uppercase tracking-[0.3em] text-sm text-cyan-400">
                        Team Details
                    </p>

                    <h1 className="mt-3 text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 bg-clip-text text-transparent">
                        {team.teamName}
                    </h1>

                </div>

                <div
                    className={`inline-flex rounded-2xl px-5 py-3 text-sm font-bold

               ${team.status ===
                            "verified"

                            ? "bg-green-500/20 text-green-400"

                            : team.status ===
                                "rejected"

                                ? "bg-red-500/20 text-red-400"

                                : "bg-yellow-500/20 text-yellow-400"
                        }`}
                >

                    {team.status}

                </div>

            </div>

            {/* SCROLL */}

            <div className="mt-10 flex-1 overflow-y-auto pr-2">

                {/* STATS */}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

                    <div className="rounded-3xl border border-cyan-500/20 bg-white/[0.03] p-8">

                        <Users
                            size={40}
                            className="text-cyan-400"
                        />

                        <h2 className="mt-5 text-4xl font-black text-white">
                            {team.players.length}
                        </h2>

                        <p className="mt-2 text-gray-400">
                            Total Players
                        </p>

                    </div>

                    <div className="rounded-3xl border border-purple-500/20 bg-white/[0.03] p-8">

                        <ShieldCheck
                            size={40}
                            className="text-purple-400"
                        />

                        <h2 className="mt-5 text-2xl font-black text-white">
                            {
                                team.group
                                    ? "Assigned"
                                    : "Pending"
                            }
                        </h2>

                        <p className="mt-2 text-gray-400">
                            Group Status
                        </p>

                    </div>

                    <div className="rounded-3xl border border-green-500/20 bg-white/[0.03] p-8">

                        <h2 className="text-2xl font-black text-white">
                            {team.leaderName}
                        </h2>

                        <p className="mt-2 text-gray-400">
                            Team Leader
                        </p>

                        <p className="mt-5 text-white">
                            {team.leaderPhone}
                        </p>

                    </div>

                    <div className="rounded-3xl border border-yellow-500/20 bg-white/[0.03] p-8">

                        <p className="uppercase tracking-[0.25em] text-xs text-yellow-400">
                            Registered By
                        </p>

                        <h2 className="mt-4 text-2xl font-black text-white break-all">
                            {
                                team.registeredBy?.email ||
                                "Seeder Team"
                            }
                        </h2>

                        <p className="mt-3 text-gray-400">
                            {
                                team.registeredBy?.username ||
                                "System Generated"
                            }
                        </p>

                    </div>

                    <div className="rounded-3xl border border-red-500/20 bg-white/[0.03] p-8">

                        <p className="uppercase tracking-[0.25em] text-xs text-red-400">
                            Tournament Progress
                        </p>

                        <h2 className="mt-5 text-3xl font-black text-white">

                            {
                                team.isEliminated

                                    ? "Eliminated"

                                    : "Active"
                            }

                        </h2>

                        <div className="mt-6 space-y-3 text-gray-300">

                            <p>

                                Current Round:
                                {" "}

                                {
                                    team.group?.round?.name ||
                                    "Not Assigned"
                                }

                            </p>

                            <pre className="mt-4 text-xs text-white">
                                {
                                    JSON.stringify(
                                        team.currentRound,
                                        null,
                                        2
                                    )
                                }
                            </pre>

                            <p>

                                Current Group:
                                {" "}

                                {
                                    team.group?.name ||
                                    "No Group"
                                }

                            </p>

                            {
                                team.isEliminated && (

                                    <p className="text-red-400">

                                        Eliminated In:
                                        {" "}

                                        {
                                            team.eliminatedInRound?.name
                                        }

                                    </p>

                                )
                            }

                        </div>

                    </div>

                </div>

                {/* PLAYERS */}

                <div className="mt-14">

                    <p className="uppercase tracking-[0.3em] text-xs text-cyan-400">
                        Team Members
                    </p>

                    <h2 className="mt-2 text-4xl font-black text-white">
                        Players
                    </h2>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                        {
                            team.players.map(
                                (
                                    player,
                                    index
                                ) => (

                                    <div
                                        key={index}
                                        className="rounded-3xl border border-white/10 bg-white/[0.03] p-8"
                                    >

                                        <p className="uppercase tracking-[0.25em] text-xs text-cyan-400">
                                            Player {index + 1}
                                        </p>

                                        <h2 className="mt-3 text-3xl font-black text-white">
                                            {player.ign}
                                        </h2>

                                        <div className="mt-6 space-y-3">

                                            <p className="text-gray-400">
                                                UID:
                                                {" "}
                                                {player.uid}
                                            </p>

                                            <p className="text-gray-400">
                                                Phone:
                                                {" "}
                                                {player.phone}
                                            </p>

                                        </div>

                                    </div>

                                )
                            )
                        }

                    </div>

                </div>

            </div>

        </div>

    );

}
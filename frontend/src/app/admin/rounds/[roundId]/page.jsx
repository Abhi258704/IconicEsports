"use client";

import {
    use,
    useEffect,
    useState,
} from "react";

import Link from "next/link";

import {
    ArrowLeft,
    Trophy,
    Layers3,
    Users,
    Swords,
    Plus,
} from "lucide-react";

import API from "@/lib/axios";

export default function RoundDetailsPage({
    params,
}) {

    const { roundId } =
        use(params);

    const [round, setRound] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        fetchRound();

    }, []);

    const fetchRound =
        async () => {

            try {

                const res =
                    await API.get(
                        `/rounds/${roundId}`
                    );

                setRound(
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

                <div className="h-20 w-20 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />

            </div>

        );

    }

    if (!round) {

        return (

            <div className="min-h-[70vh] flex items-center justify-center text-white">

                Round not found

            </div>

        );

    }

    return (

        <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden">

            {/* HEADER */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div>

                    <Link
                        href={
                            round
                                ? `/admin/tournaments/${round.tournament}/rounds`
                                : "/admin/tournaments"
                        }
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-gray-300 transition hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-white"
                    >

                        <ArrowLeft size={18} />

                        Back

                    </Link>

                    <p className="mt-6 uppercase tracking-[0.3em] text-sm text-purple-400">
                        Round Management
                    </p>

                    <h1 className="mt-3 text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                        {round.name}
                    </h1>

                </div>

                {/* <button
                    className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-4 font-bold text-white transition hover:scale-105"
                >

                    <Plus size={20} />

                    Create Group

                </button> */}

            </div>

            {/* SCROLL */}

            <div className="mt-10 flex-1 overflow-y-auto pr-2">

                {/* STATS */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="rounded-3xl border border-purple-500/20 bg-white/[0.03] p-8">

                        <Trophy
                            size={40}
                            className="text-purple-400"
                        />

                        <h2 className="mt-5 text-4xl font-black text-white">
                            {round.qualificationCount}
                        </h2>

                        <p className="mt-2 text-gray-400">
                            Qualification Count
                        </p>

                    </div>

                    <div className="rounded-3xl border border-cyan-500/20 bg-white/[0.03] p-8">

                        <Layers3
                            size={40}
                            className="text-cyan-400"
                        />

                        <h2 className="mt-5 text-4xl font-black text-white">
                            {round.groups?.length || 0}
                        </h2>

                        <p className="mt-2 text-gray-400">
                            Total Groups
                        </p>

                    </div>

                    <div className="rounded-3xl border border-pink-500/20 bg-white/[0.03] p-8">

                        <Users
                            size={40}
                            className="text-pink-400"
                        />

                        <h2 className="mt-5 text-4xl font-black text-white">
                            {round.status}
                        </h2>

                        <p className="mt-2 text-gray-400">
                            Round Status
                        </p>

                    </div>

                </div>

                {/* GROUPS */}

                <div className="mt-12">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="uppercase tracking-[0.3em] text-xs text-purple-400">
                                Group Management
                            </p>

                            <h2 className="mt-2 text-4xl font-black text-white">
                                Groups
                            </h2>

                        </div>

                    </div>

                    {
                        round.groups?.length === 0 ? (

                            <div className="mt-8 rounded-3xl border border-purple-500/20 bg-white/[0.03] p-16 text-center">

                                <Layers3
                                    size={70}
                                    className="mx-auto text-purple-400"
                                />

                                <h2 className="mt-6 text-3xl font-black text-white">
                                    No Groups Yet
                                </h2>

                                <p className="mt-3 text-gray-400">
                                    Create your first round group.
                                </p>

                            </div>

                        ) : (

                            <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-8">

                                {
                                    round.groups.map(
                                        (group) => (

                                            <div
                                                key={group._id}
                                                className="rounded-3xl border border-purple-500/20 bg-white/[0.03] p-8"
                                            >

                                                <div className="flex items-start justify-between gap-4">

                                                    <div>

                                                        <p className="uppercase tracking-[0.25em] text-xs text-purple-400">
                                                            Group
                                                        </p>

                                                        <h2 className="mt-3 text-4xl font-black text-white">
                                                            {group.name}
                                                        </h2>

                                                    </div>

                                                    <div className="rounded-2xl bg-purple-500/20 px-4 py-2 text-sm font-bold text-purple-300">

                                                        Active

                                                    </div>

                                                </div>

                                                {/* STATS */}

                                                <div className="mt-8 grid grid-cols-2 gap-5">

                                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

                                                        <p className="text-sm text-gray-400">
                                                            Teams
                                                        </p>

                                                        <h2 className="mt-3 text-3xl font-black text-white">
                                                            {group.teams?.length || 0}
                                                        </h2>

                                                    </div>

                                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

                                                        <p className="text-sm text-gray-400">
                                                            Matches
                                                        </p>

                                                        <h2 className="mt-3 text-3xl font-black text-white">
                                                            {group.matches?.length || 0}
                                                        </h2>

                                                    </div>

                                                </div>

                                                {/* ACTION */}

                                                <div className="mt-8">

                                                    <Link
                                                        href={`/admin/groups/${group._id}`}
                                                        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-4 font-bold text-white transition hover:scale-105"
                                                    >

                                                        <Swords size={18} />

                                                        Manage Group

                                                    </Link>

                                                </div>

                                            </div>

                                        )
                                    )
                                }

                            </div>

                        )
                    }

                </div>

            </div>

        </div>

    );

}
"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    useParams,
} from "next/navigation";

import Link
    from "next/link";

import axios
    from "@/lib/axios";

import {
    ArrowLeft,
    Boxes,
} from "lucide-react";

export default function GroupSlotsPage() {

    const { id } =
        useParams();

    const [group, setGroup] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const fetchGroup =
        async () => {

            try {

                const res =
                    await axios.get(
                        `/groups/${id}`
                    );

                setGroup(
                    res.data.data
                );

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        };

    useEffect(() => {

        if (id) {

            fetchGroup();

        }

    }, [id]);

    if (loading) {

        return (

            <div className="min-h-[70vh] flex items-center justify-center">

                <div className="h-20 w-20 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />

            </div>

        );

    }

    if (!group) {

        return (

            <div className="min-h-[70vh] flex items-center justify-center text-white">

                Group not found

            </div>

        );

    }

    return (

        <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden">

            {/* HEADER */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div className="flex gap-7 items-center">

                    <Link
                        href={`/admin/groups/${group._id}`}
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-gray-300 transition hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-white"
                    >

                        <ArrowLeft size={18} />

                        Back

                    </Link>

                    {/* <p className="mt-6 uppercase tracking-[0.3em] text-sm text-cyan-400">
                        Lobby Management
                    </p> */}

                    <h1 className="mt-3 flex flex-wrap items-center text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 bg-clip-text text-transparent">

                        {group.name}

                        <span className="ml-4 text-2xl font-bold text-purple-400">

                            • {group.round?.name}

                        </span>

                    </h1>

                    <p className="ml-4 text-2xl font-bold text-purple-200">Teams will refer this</p>

                </div>

            </div>

            {/* CONTENT */}

            <div className="mt-10 flex-1 overflow-y-auto pr-2">

                {/* SLOTS */}

                <div>

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="uppercase tracking-[0.3em] text-xs text-cyan-400">
                                Slot Assignment
                            </p>

                            <h2 className="mt-2 text-4xl font-black text-white">
                                Slots
                            </h2>

                        </div>

                    </div>

                    <div className="mt-8 overflow-hidden rounded-3xl border border-cyan-500/20 bg-white/[0.03]">

                        {/* TABLE HEADER */}

                        <div className="grid grid-cols-3 border-b border-white/10 bg-black/30 px-6 py-4">

                            <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">

                                Slot

                            </h3>

                            <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">

                                Team

                            </h3>

                            <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">

                                Status

                            </h3>

                        </div>

                        {/* ROWS */}

                        <div>

                            {
                                group.teams?.map(
                                    (
                                        team,
                                        index
                                    ) => (

                                        <div
                                            key={team._id}
                                            className="grid grid-cols-3 items-center border-b border-white/5 px-6 py-3 transition hover:bg-white/[0.03]"
                                        >

                                            {/* SLOT */}

                                            <div>

                                                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-base font-black text-cyan-300">

                                                    {index + 4}

                                                </div>

                                            </div>

                                            {/* TEAM */}

                                            <div>

                                                <h2 className="text-lg font-bold text-white">

                                                    {team.teamName}

                                                </h2>

                                                <p className="mt-1 text-xs text-gray-400">

                                                    {team.leaderName}

                                                </p>

                                            </div>

                                            {/* STATUS */}

                                            <div>

                                                <div className="inline-flex rounded-xl bg-green-500/20 px-3 py-1.5 text-xs font-bold text-green-300">

                                                    {team.status}

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )
                            }

                        </div>

                    </div>

                </div>

                {/* STICKY FOOTER */}

                {/* <div className="sticky bottom-0 mt-10 rounded-3xl border border-dashed border-cyan-500/20 bg-[#0a0a0a]/95 backdrop-blur-xl p-8">

                    <div className="flex items-start justify-between gap-6 flex-wrap">

                        <div>

                            <p className="uppercase tracking-[0.3em] text-xs text-cyan-400">
                                Manual Override
                            </p>

                            <h2 className="mt-3 text-3xl font-black text-white">
                                Advanced Slot Controls
                            </h2>

                            <p className="mt-4 max-w-2xl text-gray-400">

                                Future admin controls for:
                                moving teams,
                                swapping slots,
                                adding extra teams,
                                and manual lobby balancing.

                            </p>

                        </div>

                        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-4">

                            <Boxes
                                size={32}
                                className="text-cyan-400"
                            />

                        </div>

                    </div>

                </div> */}

            </div>

        </div>

    );

}
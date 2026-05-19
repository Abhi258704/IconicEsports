"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    useParams,
} from "next/navigation";

import Link from "next/link";

import axios from "@/lib/axios";

import {
    ArrowLeft,
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

            }

            catch (error) {

                console.log(error);

            }

            finally {

                setLoading(false);

            }

        };

    useEffect(() => {

        if (id) {

            fetchGroup();

        }

    }, [id]);

    if (
        loading
    ) {

        return (

            <div className="h-full flex items-center justify-center">

                <div className="h-20 w-20 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />

            </div>

        );

    }

    if (
        !group
    ) {

        return (

            <div className="h-full flex items-center justify-center">

                Group not found

            </div>

        );

    }

    return (

        <div className="h-[calc(100vh-96px)] overflow-hidden flex flex-col">

            {/* HEADER */}

            <div className="flex-shrink-0">

                <div className="flex items-center gap-7 flex-wrap">

                    <Link

                        href={`/moderator/groups/${group._id}`}

                        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 hover:border-cyan-500/30 hover:bg-cyan-500/10"

                    >

                        <ArrowLeft size={18} />

                        Back

                    </Link>

                    <div>

                        <h1 className="flex flex-wrap items-center text-5xl font-black">

                            {group.name}

                            <span className="ml-4 text-2xl text-purple-400">

                                •

                                {" "}

                                {group.round?.name}

                            </span>

                        </h1>

                        <p className="mt-2 text-purple-200">

                            Teams will refer this

                        </p>

                    </div>

                </div>

            </div>

            {/* TABLE */}

            <div className="mt-10 flex-1 min-h-0 overflow-hidden">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="uppercase tracking-[0.3em] text-xs text-cyan-400">

                            Slot Assignment

                        </p>

                        <h2 className="mt-2 text-4xl font-black">

                            Slots

                        </h2>

                    </div>

                </div>

                <div className="mt-8 h-full overflow-hidden rounded-3xl border border-cyan-500/20 bg-white/[0.03]">

                    {/* HEADER */}

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

                    {/* BODY */}

                    <div className="h-[calc(100%-72px)] overflow-y-auto">

                        {

                            group.teams?.map(

                                (team, index) => (

                                    <div

                                        key={team._id}

                                        className="grid grid-cols-3 items-center border-b border-white/5 px-6 py-3 hover:bg-white/[0.03]"

                                    >

                                        <div>

                                            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-base font-black text-cyan-300">

                                                {index + 4}

                                            </div>

                                        </div>

                                        <div>

                                            <h2 className="text-lg font-bold">

                                                {team.teamName}

                                            </h2>

                                            <p className="mt-1 text-xs text-gray-400">

                                                {team.leaderName}

                                            </p>

                                        </div>

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

        </div>

    );

}
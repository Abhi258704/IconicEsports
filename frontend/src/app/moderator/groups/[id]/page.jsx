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

import toast from "react-hot-toast";

import {
    Users,
    ArrowLeft,
    Swords,
} from "lucide-react";

export default function GroupPage() {

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

                toast.error(

                    error?.response?.data?.message ||

                    "Failed to load group"

                );

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
        loading ||
        !group
    ) {

        return (

            <div className="h-full flex items-center justify-center">

                <div className="h-20 w-20 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />

            </div>

        );

    }

    return (

        <div className="h-[calc(100vh-96px)] overflow-hidden flex flex-col gap-8">

            {/* HEADER */}

            <div className="flex-shrink-0 rounded-3xl border border-cyan-500/20 bg-white/[0.03] p-8">

                <Link

                    href="/moderator/groups"

                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-5 py-3 hover:border-cyan-500 hover:bg-cyan-500/10"

                >

                    <ArrowLeft size={18} />

                    Back

                </Link>

                <div className="mt-8 flex flex-wrap gap-5 items-center">

                    <div>

                        <p className="uppercase text-cyan-400">

                            Group Management

                        </p>

                        <h1 className="text-6xl font-black">

                            {group.name}

                        </h1>

                    </div>

                    <div className="rounded-2xl border border-cyan-500/20 px-5 py-3">

                        <p className="text-gray-400">

                            Teams

                        </p>

                        <h2 className="text-3xl font-black">

                            {group.teams?.length || 0}

                        </h2>

                    </div>

                    <div className="rounded-2xl border border-purple-500/20 px-5 py-3">

                        <p className="text-gray-400">

                            Round

                        </p>

                        <h2 className="text-2xl font-black">

                            {group.round?.name}

                        </h2>

                    </div>

                    <Link

                        href={`/moderator/groups/${group._id}/slots`}

                        className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 font-bold"

                    >

                        Slots

                    </Link>

                    <Link

                        href={`/moderator/groups/${group._id}/matches`}

                        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 font-bold"

                    >

                        <Swords size={18} />

                        Matches

                    </Link>

                </div>

            </div>

            {/* TEAMS */}

            <div className="flex-1 min-h-0 overflow-hidden">

                <p className="uppercase text-cyan-400">

                    Team Management

                </p>

                <h2 className="mt-2 text-4xl font-black">

                    Teams

                </h2>

                {

                    group.teams?.length === 0

                        ?

                        (

                            <div className="mt-8 rounded-3xl border border-cyan-500/20 bg-white/[0.03] p-16 text-center">

                                <Users
                                    size={70}
                                    className="mx-auto text-cyan-400"
                                />

                                <h2 className="mt-6 text-3xl font-black">

                                    No Teams Yet

                                </h2>

                            </div>

                        )

                        :

                        (

                            <div className="mt-8 h-full overflow-y-auto pr-2 pb-8">

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20">

                                    {

                                        group.teams.map(

                                            team => (

                                                <Link

                                                    key={team._id}

                                                    href={`/moderator/teams/${team._id}?from=group&groupId=${group._id}`}

                                                    className="block rounded-3xl border border-cyan-500/20 bg-white/[0.03] p-8 transition hover:-translate-y-1 hover:border-cyan-500/50 hover:bg-cyan-500/[0.04]"

                                                >

                                                    <div className="flex justify-between">

                                                        <div>

                                                            <p className="uppercase text-xs text-cyan-400">

                                                                Team

                                                            </p>

                                                            <h2 className="mt-3 text-3xl font-black">

                                                                {team.teamName}

                                                            </h2>

                                                        </div>

                                                        <div className="rounded-2xl bg-green-500/20 px-4 py-2 text-sm font-bold text-green-300">

                                                            {team.status}

                                                        </div>

                                                    </div>

                                                    <div className="mt-8 space-y-3 text-gray-300">

                                                        <p>

                                                            Leader:
                                                            {" "}
                                                            {team.leaderName}

                                                        </p>

                                                        <p>

                                                            Phone:
                                                            {" "}
                                                            {team.leaderPhone}

                                                        </p>

                                                    </div>

                                                </Link>

                                            )

                                        )

                                    }

                                </div>

                            </div>

                        )

                }

            </div>

        </div>

    );

}
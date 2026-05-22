"use client";

import {
    useEffect,
    useState,
} from "react";

import Link
    from "next/link";

import {
    useParams,
} from "next/navigation";

import API
    from "@/lib/axios";

import toast
    from "react-hot-toast";

export default function TeamPage() {

    const {
        teamId
    } =
        useParams();

    const [
        team,
        setTeam
    ] =
        useState(null);

    const [
        loading,
        setLoading
    ] =
        useState(true);

    useEffect(() => {

        const fetchData =
            async () => {

                try {

                    const res =
                        await API.get(

                            `/teams/${teamId}`

                        );

                    setTeam(

                        res.data.data

                    );

                }

                catch {

                    toast.error(
                        "Failed"
                    );

                }

                finally {

                    setLoading(
                        false
                    );

                }

            };

        fetchData();

    }, [
        teamId
    ]);

    if (
        loading
    ) {

        return (

            <div className="p-5">

                Loading...

            </div>

        );

    }

    if (
        !team
    ) {

        return null;

    }

    return (

        <div className="space-y-8">

            {/* TOP */}

            <div className="rounded-3xl border border-cyan-500/10 bg-white/[0.03] p-6">

                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                        <p className="uppercase tracking-[0.3em] text-xs text-cyan-400">

                            MY TOURNAMENT

                        </p>

                        <h1 className="mt-3 text-4xl font-black">

                            {
                                team.teamName
                            }

                        </h1>

                        <p className="mt-3 text-gray-400">

                            {
                                team.tournament?.name
                            }

                        </p>

                    </div>

                    <div className="flex w-full justify-start lg:w-auto lg:justify-end">

                        <div className="flex w-full items-stretch gap-3 lg:w-auto">

                            <div

                                className={`flex min-h-[78px] min-w-[130px] items-center justify-center rounded-2xl px-5 text-center text-sm font-black

${team.isEliminated

                                        ?

                                        "border border-red-500/20 bg-red-500/10 text-red-400"

                                        :

                                        team.status === "verified"

                                            ?

                                            "bg-green-500/20 text-green-400"

                                            :

                                            team.status === "rejected"

                                                ?

                                                "bg-red-500/20 text-red-400"

                                                :

                                                "bg-yellow-500/20 text-yellow-400"

                                    }

`}

                            >

                                {

                                    team.isEliminated

                                        ?

                                        "ELIMINATED"

                                        :

                                        team.status.toUpperCase()

                                }

                            </div>

                            <div className="flex-1 rounded-2xl bg-white/[0.04] px-5 py-4">

                                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">

                                    Current Round

                                </p>

                                <p className="mt-1 font-black">

                                    {

                                        team.currentRound?.name

                                        ||

                                        (

                                            team.isEliminated

                                                ?

                                                "Tournament Ended"

                                                :

                                                "Not Assigned"

                                        )

                                    }

                                </p>

                                {

                                    team.isEliminated

                                    &&

                                    <>

                                        <div className="my-3 h-px bg-red-500/10" />

                                        <p className="text-[10px] uppercase tracking-[0.25em] text-red-300">

                                            Eliminated In

                                        </p>

                                        <p className="mt-1 font-black text-red-400">

                                            {

                                                team.eliminatedInRound?.name

                                                ||

                                                "Unknown Round"

                                            }

                                        </p>

                                    </>

                                }

                            </div>

                        </div>

                    </div>

                </div>

            </div>



            {/* ACTIONS */}

            <div className="mt-8 grid grid-cols-2 gap-3">

                <Link

                    href={`/user/my-tournaments/${teamId}/current-match`}

                    className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 transition hover:bg-red-500/15 md:p-6"

                >

                    <p className="text-[10px] tracking-[0.25em] text-red-400">

                        IDP

                    </p>

                    <h2 className="mt-2 text-lg font-black text-red-400 md:text-2xl">

                        CURRENT MATCH

                    </h2>

                    <p className="mt-2 text-xs text-gray-400">

                        {

                            team.currentRound?.name

                                ?

                                `Round • ${team.currentRound.name}`

                                :

                                "Waiting"

                        }

                    </p>

                </Link>

                <Link

                    href={`/user/my-tournaments/${teamId}/matches`}

                    className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-4 transition hover:bg-cyan-500/15 md:p-6"

                >

                    <p className="text-[10px] tracking-[0.25em] text-cyan-400">

                        BACKUP IDP

                    </p>

                    <h2 className="mt-2 text-lg font-black text-cyan-400 md:text-2xl">

                        ALL MATCHES

                    </h2>

                    <p className="mt-2 text-xs text-gray-400">

                        Room • Schedule

                    </p>

                </Link>

                <Link

                    href={`/user/my-tournaments/${teamId}/results`}

                    className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-4 transition hover:bg-yellow-500/15 md:p-6"

                >

                    <p className="text-[10px] tracking-[0.25em] text-yellow-400">

                        TOURNAMENT

                    </p>

                    <h2 className="mt-2 text-lg font-black text-yellow-400 md:text-2xl">

                        RESULTS

                    </h2>

                    <p className="mt-2 text-xs text-gray-400">

                        Leaderboard

                    </p>

                </Link>

                <Link

                    href={`/user/my-tournaments/${teamId}/team`}

                    className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-4 transition hover:bg-purple-500/15 md:p-6"

                >

                    <p className="text-[10px] tracking-[0.25em] text-purple-400">

                        TEAM

                    </p>

                    <h2 className="mt-2 text-lg font-black text-purple-400 md:text-2xl">

                        MY TEAM

                    </h2>

                    <p className="mt-2 text-xs text-gray-400">

                        Players • Slot

                    </p>

                </Link>

            </div>
        </div>

    );

}
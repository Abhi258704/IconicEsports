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

                    <div>

                        <div

                            className={`inline-flex rounded-2xl px-5 py-3 text-sm font-bold

                                    ${team.status === "verified"

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

                                team.status

                                    .toUpperCase()

                            }

                        </div>

                    </div>

                </div>

            </div>



            {/* ACTIONS */}

            <div className="mt-8 flex flex-col gap-3">

                <Link

                    href={`/user/my-tournaments/${teamId}/team`}

                    className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-5 transition hover:bg-cyan-500/15"

                >

                    <h2 className="text-lg font-black text-cyan-400">

                        MY TEAM

                    </h2>

                </Link>



                <Link

                    href={`/user/my-tournaments/${teamId}/current-round`}

                    className="rounded-2xl border border-purple-500/20 bg-purple-500/10 px-5 py-5 transition hover:bg-purple-500/15"

                >

                    <h2 className="text-lg font-black text-purple-400">

                        {

                            team.currentRound?.name

                            ||

                            "CURRENT ROUND"

                        }

                    </h2>

                </Link>



                <Link

                    href={`/user/my-tournaments/${teamId}/history`}

                    className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-5 py-5 transition hover:bg-yellow-500/15"

                >

                    <h2 className="text-lg font-black text-yellow-400">

                        PREVIOUS ROUNDS

                    </h2>

                </Link>

            </div>

        </div>

    );

}
"use client";

import {
    useEffect,
    useState,
} from "react";

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

        <div className="mx-auto max-w-5xl p-5 space-y-6">

            {/* HEADER */}

            <div className="rounded-3xl border border-cyan-500/10 bg-white/[0.03] p-6">

                <div className="flex items-start justify-between">

                    <div>

                        <p className="text-xs tracking-[0.25em] text-cyan-400">

                            MY TEAM

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

                    <div className="flex flex-col items-end gap-3">

                        <div

                            className={`rounded-2xl px-5 py-3 text-sm font-black

${team.isEliminated

                                    ?

                                    "bg-red-500/20 text-red-400 border border-red-500/20"

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

                        {

                            team.isEliminated

                            &&

                            (

                                <div className="rounded-2xl bg-red-500/10 px-4 py-3 text-right">

                                    <p className="text-xs uppercase tracking-[0.2em] text-red-300">

                                        Eliminated In

                                    </p>

                                    <p className="mt-1 font-black text-red-400">

                                        {

                                            team.eliminatedInRound?.name

                                            ||

                                            "Unknown Round"

                                        }

                                    </p>

                                </div>

                            )

                        }

                    </div>

                </div>

            </div>



            {/* DETAILS */}

            <div className="grid gap-4">

                <div className="rounded-3xl bg-white/[0.03] p-5">

                    <p className="text-gray-500">

                        Leader

                    </p>

                    <h2 className="mt-2 text-2xl font-bold">

                        {
                            team.leaderName
                        }

                    </h2>

                    <p className="mt-2 text-gray-400">

                        {
                            team.leaderPhone
                        }

                    </p>

                </div>



                <div className="rounded-3xl bg-white/[0.03] p-5">

                    <p className="text-gray-500">

                        Current Round

                    </p>

                    <h2 className="mt-2 text-2xl font-bold">

                        {

                            team.currentRound?.name

                            ||

                            "Not Assigned"

                        }

                    </h2>

                </div>



                <div className="rounded-3xl bg-white/[0.03] p-5">

                    <p className="text-gray-500">

                        Group

                    </p>

                    <h2 className="mt-2 text-2xl font-bold">

                        {

                            team.group?.name

                            ||

                            "Pending"

                        }

                    </h2>

                </div>



                <div className="rounded-3xl bg-white/[0.03] p-5">

                    <p className="text-gray-500">

                        Qualified Rounds

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                        {

                            team.qualifiedRounds?.length

                                ?

                                team.qualifiedRounds.map(

                                    (
                                        round
                                    ) => (

                                        <div

                                            key={
                                                round._id
                                            }

                                            className="rounded-xl bg-green-500/10 px-3 py-2 text-green-400"

                                        >

                                            {
                                                round.name
                                            }

                                        </div>

                                    )

                                )

                                :

                                <span className="text-gray-400">

                                    None

                                </span>

                        }

                    </div>

                </div>



                <div className="rounded-3xl bg-white/[0.03] p-5">

                    <p className="text-gray-500">

                        Registered

                    </p>

                    <h2 className="mt-2 text-xl">

                        {

                            new Date(

                                team.createdAt

                            )

                                .toLocaleDateString()

                        }

                    </h2>

                </div>

            </div>



            {/* PLAYERS */}

            <div>

                <h2 className="mb-4 text-3xl font-black">

                    Players

                </h2>

                <div className="space-y-3">

                    {

                        team.players.map(

                            (
                                player,
                                index
                            ) => (

                                <div

                                    key={
                                        index
                                    }

                                    className="rounded-3xl bg-white/[0.03] p-5"

                                >

                                    <div className="flex justify-between">

                                        <h3 className="font-black">

                                            Player {

                                                index + 1

                                            }

                                        </h3>

                                        <p className="text-cyan-400">

                                            {
                                                player.ign
                                            }

                                        </p>

                                    </div>

                                    <div className="mt-4 text-sm text-gray-400">

                                        <p>

                                            UID:
                                            {
                                                player.uid
                                            }

                                        </p>

                                        <p className="mt-2">

                                            Phone:
                                            {
                                                player.phone
                                            }

                                        </p>

                                    </div>

                                </div>

                            )

                        )

                    }

                </div>

            </div>

        </div>

    );

}
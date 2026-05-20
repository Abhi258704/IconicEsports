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

export default function LeaderboardPage() {

    const {
        groupId
    } =
        useParams();

    const [
        loading,
        setLoading
    ] =
        useState(true);

    const [
        leaderboard,
        setLeaderboard
    ] =
        useState([]);

    useEffect(() => {

        const fetchLeaderboard =
            async () => {

                try {

                    const res =

                        await API.get(

                            `/groups/${groupId}/leaderboard`

                        );

                    setLeaderboard(

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

        fetchLeaderboard();

    }, [
        groupId
    ]);

    if (
        loading
    ) {

        return (

            <div className="p-6">

                Loading...

            </div>

        );

    }

    return (

        <div className="space-y-4">

            <div>

                <p className="text-xs tracking-[0.25em] text-yellow-400">

                    GROUP

                </p>

                <h1 className="mt-2 text-4xl font-black">

                    Leaderboard

                </h1>

            </div>

            {

                leaderboard.length

                ?

                leaderboard.map(

                    (
                        row,
                        index
                    ) => (

                        <div

                            key={
                                row.team._id
                            }

                            className={`rounded-3xl p-5

${

index < 4

?

"bg-yellow-500/10 border border-yellow-500/20"

:

"bg-white/[0.03]"

}

`}

                        >

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-xs text-gray-400">

                                        #

                                        {

                                            index + 1

                                        }

                                    </p>

                                    <h2 className="mt-2 text-xl font-black">

                                        {

                                            row.team.teamName

                                        }

                                    </h2>

                                </div>

                                <div className="text-right">

                                    <p className="text-3xl font-black">

                                        {

                                            row.totalPoints

                                        }

                                    </p>

                                    <p className="text-xs text-gray-400">

                                        POINTS

                                    </p>

                                </div>

                            </div>

                            <div className="mt-5 grid grid-cols-3 gap-3">

                                <div>

                                    <p className="text-xs text-gray-500">

                                        Matches

                                    </p>

                                    <p className="font-black">

                                        {

                                            row.matchesPlayed

                                        }

                                    </p>

                                </div>

                                <div>

                                    <p className="text-xs text-gray-500">

                                        Kills

                                    </p>

                                    <p className="font-black">

                                        {

                                            row.totalKills

                                        }

                                    </p>

                                </div>

                                <div>

                                    <p className="text-xs text-gray-500">

                                        Placement

                                    </p>

                                    <p className="font-black">

                                        {

                                            row.totalPlacementPoints

                                        }

                                    </p>

                                </div>

                            </div>

                        </div>

                    )

                )

                :

                (

                    <div className="rounded-3xl bg-white/[0.03] p-8 text-center">

                        No Leaderboard

                    </div>

                )

            }

        </div>

    );

}
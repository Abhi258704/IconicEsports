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

export default function MatchResultPage() {

    const {
        matchId
    } =
        useParams();

    const [
        loading,
        setLoading
    ] =
        useState(true);

    const [
        match,
        setMatch
    ] =
        useState(null);

    useEffect(() => {

        const fetchMatch =
            async () => {

                try {

                    const res =

                        await API.get(

                            `/matches/public/${matchId}`

                        );

                    setMatch(
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

        fetchMatch();

    }, [
        matchId
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

    if (
        !match
    ) {

        return null;

    }

    const results =

        [
            ...(match.results || [])
        ]

            .sort(

                (
                    a,
                    b
                ) =>

                    b.totalPoints
                    -
                    a.totalPoints

            );

    return (

        <div className="space-y-5">

            <div>

                <p className="text-xs tracking-[0.25em] text-cyan-400">

                    MATCH RESULT

                </p>

                <h1 className="mt-2 text-4xl font-black">

                    Match {

                        match.matchNumber

                    }

                </h1>

            </div>

            {

                results.map(

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

index < 3

?

"border border-yellow-500/20 bg-yellow-500/10"

:

"bg-white/[0.03]"

}

`}

                        >

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-xs text-gray-500">

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

                                    <p className="text-xs text-gray-500">

                                        POINTS

                                    </p>

                                </div>

                            </div>

                            <div className="mt-5 grid grid-cols-3 gap-3">

                                <div>

                                    <p className="text-xs text-gray-500">

                                        Rank

                                    </p>

                                    <p className="font-black">

                                        {

                                            row.rank

                                        }

                                    </p>

                                </div>

                                <div>

                                    <p className="text-xs text-gray-500">

                                        Kills

                                    </p>

                                    <p className="font-black">

                                        {

                                            row.kills

                                        }

                                    </p>

                                </div>

                                <div>

                                    <p className="text-xs text-gray-500">

                                        Placement

                                    </p>

                                    <p className="font-black">

                                        {

                                            row.placementPoints

                                        }

                                    </p>

                                </div>

                            </div>

                        </div>

                    )

                )

            }

            <div className="rounded-3xl bg-white/[0.03] p-5">

                <div className="grid grid-cols-2 gap-4">

                    <div>

                        <p className="text-xs text-gray-500">

                            Room ID

                        </p>

                        <p className="font-black">

                            {

                                match.roomId

                                ||

                                "-"

                            }

                        </p>

                    </div>

                    <div>

                        <p className="text-xs text-gray-500">

                            Room Pass

                        </p>

                        <p className="font-black">

                            {

                                match.roomPassword

                                ||

                                "-"

                            }

                        </p>

                    </div>

                    <div>

                        <p className="text-xs text-gray-500">

                            Start Time

                        </p>

                        <p>

                            {

                                match.startTime

                                    ?

                                    new Date(
                                        match.startTime
                                    )

                                    .toLocaleTimeString()

                                    :

                                    "-"

                            }

                        </p>

                    </div>

                    <div>

                        <p className="text-xs text-gray-500">

                            Date

                        </p>

                        <p>

                            {

                                match.scheduledAt

                                    ?

                                    new Date(
                                        match.scheduledAt
                                    )

                                    .toLocaleDateString()

                                    :

                                    "-"

                            }

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}
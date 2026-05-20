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

export default function GroupResultsPage() {

    const {
        teamId,
        roundId,
        groupId,
    } =
        useParams();

    const [
        loading,
        setLoading
    ] =
        useState(true);

    const [
        group,
        setGroup
    ] =
        useState(null);

    const [
        matches,
        setMatches
    ] =
        useState([]);

    useEffect(() => {

        const fetchData =
            async () => {

                try {

                    const [

                        groupRes,

                        matchRes,

                    ] =

                        await Promise.all([

                            API.get(

                                `/groups/${groupId}/leaderboard`

                            ),

                            API.get(
                                `/matches/public/group/${groupId}`
                            ),

                        ]);

                    setGroup(

                        groupRes.data.data

                    );

                    setMatches(

                        matchRes.data.data

                            .filter(

                                m =>

                                    m.status ===
                                    "completed"

                            )

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

        <div className="space-y-5">

            <div>

                <p className="text-xs tracking-[0.25em] text-cyan-400">

                    ROUND RESULTS

                </p>

                <h1 className="mt-2 text-4xl font-black">

                    Matches

                </h1>

            </div>

            <Link

                href={`/user/my-tournaments/${teamId}/results/${roundId}/${groupId}/leaderboard`}

                className="block rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6"

            >

                <p className="text-xs tracking-[0.25em] text-yellow-400">

                    GROUP

                </p>

                <h2 className="mt-2 text-2xl font-black text-yellow-400">

                    LEADERBOARD

                </h2>

            </Link>

            {

                matches.map(

                    match => (

                        <Link

                            key={
                                match._id
                            }

                            href={`/user/my-tournaments/${teamId}/results/match/${match._id}`}

                            className="block rounded-3xl border border-white/10 bg-white/[0.03] p-5"

                        >

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="text-xl font-black">

                                        Match {

                                            match.matchNumber

                                        }

                                    </h2>

                                    <p className="mt-2 text-gray-400">

                                        {

                                            match.map

                                        }

                                    </p>

                                </div>

                                <div>

                                    →

                                </div>

                            </div>

                        </Link>

                    )

                )

            }

            {

                !matches.length

                &&

                <div className="rounded-3xl bg-white/[0.03] p-8 text-center text-gray-400">

                    No Match Results

                </div>

            }

        </div>

    );

}
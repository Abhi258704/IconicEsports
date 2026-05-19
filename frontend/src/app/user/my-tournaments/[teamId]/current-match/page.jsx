"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    useParams,
} from "next/navigation";

import API from "@/lib/axios";

import toast from "react-hot-toast";

export default function CurrentMatchPage() {

    const {
        teamId,
    } = useParams();

    const [
        match,
        setMatch,
    ] = useState(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    useEffect(() => {

        const load =
            async () => {

                try {

                    const res =
                        await API.get(

                            `/users/my-teams/${teamId}/current-match`

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

        load();

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
        !match
    ) {

        return (

            <div className="p-5">

                <div className="rounded-3xl bg-[#0d0d0d] p-10 text-center">

                    No match yet

                </div>

            </div>

        );

    }

    const start =

        match.startTime

            ?

            new Date(
                match.startTime
            )

                .toLocaleTimeString(
                    [],

                    {

                        hour:
                            "2-digit",

                        minute:
                            "2-digit",

                        hour12:
                            false,

                    }

                )

            :

            "--:--";

    return (

        <div className="mx-auto max-w-3xl p-5 space-y-5">

            {/* INFO */}

            <div className="rounded-[2rem] border border-white/10 bg-[#0d0d0d] p-6">

                <div className="flex items-start justify-between">

                    <div>

                        <p className="text-xs text-gray-500">

                            CURRENT MATCH

                        </p>

                        <h1 className="mt-2 text-4xl font-black">

                            Match #

                            {
                                match.matchNumber
                            }

                        </h1>

                    </div>

                    <div

                        className={`rounded-full px-4 py-2 text-sm font-black

${match.status === "live"

                                ?

                                "bg-red-500 text-black"

                                :

                                "bg-yellow-500 text-black"

                            }

`}

                    >

                        {

                            match.status
                                .toUpperCase()

                        }

                    </div>

                </div>

                <div className="mt-8 grid grid-cols-2 gap-5">

                    <div>

                        <p className="text-gray-500">

                            Map

                        </p>

                        <p className="mt-2 text-xl font-bold">

                            {
                                match.map
                            }

                        </p>

                    </div>

                    <div>

                        <p className="text-gray-500">

                            Slot

                        </p>

                        <p className="mt-2 text-xl font-black text-cyan-400">

                            {

                                match.slot

                                ||

                                "Pending"

                            }

                        </p>

                    </div>

                    <div>

                        <p className="text-gray-500">

                            Scheduled

                        </p>

                        <p className="mt-2">

                            {

                                match.scheduledAt

                                    ?

                                    new Date(
                                        match.scheduledAt
                                    )

                                        .toLocaleDateString()

                                    :

                                    "TBA"

                            }

                        </p>

                    </div>

                    <div>

                        <p className="text-gray-500">

                            IDP Time

                        </p>

                        <p className="mt-2 text-xl font-black text-cyan-400">

                            {

                                match.scheduledAt

                                    ?

                                    new Date(
                                        match.scheduledAt
                                    )

                                        .toLocaleTimeString(

                                            "en-GB",

                                            {

                                                hour:
                                                    "2-digit",

                                                minute:
                                                    "2-digit",

                                                hour12:
                                                    false,

                                            }

                                        )

                                    :

                                    "--:--"

                            }

                        </p>

                    </div>
                </div>

            </div>

            {/* ROOM */}

            <div className="rounded-[2rem] bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-8">

                <div className="space-y-8">

                    <div>

                        <p className="text-sm text-gray-500">

                            START TIME

                        </p>

                        <h1 className="mt-2 text-6xl font-black">

                            {

                                start

                            }

                        </h1>

                    </div>

                    <div>

                        <p className="text-sm text-cyan-400">

                            ROOM ID

                        </p>

                        <h2 className="mt-2 break-all text-5xl font-black">

                            {

                                match.roomId

                                ||

                                "LOCKED"

                            }

                        </h2>

                    </div>

                    <div>

                        <p className="text-sm text-purple-400">

                            PASSWORD

                        </p>

                        <h2 className="mt-2 break-all text-5xl font-black">

                            {

                                match.roomPassword

                                ||

                                "LOCKED"

                            }

                        </h2>

                    </div>

                </div>

            </div>

        </div>

    );

}
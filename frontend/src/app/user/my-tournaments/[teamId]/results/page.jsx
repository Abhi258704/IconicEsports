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

export default function ResultsPage() {

    const {
        teamId
    } =
        useParams();

    const [
        loading,
        setLoading
    ] =
        useState(true);

    const [
        sections,
        setSections
    ] =
        useState([]);

    useEffect(() => {

        const fetchData =
            async () => {

                try {

                    const res =

                        await API.get(

                            `/users/my-teams/${teamId}/results`

                        );

                    setSections(

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

            <div className="p-6">

                Loading...

            </div>

        );

    }

    return (

        <div className="space-y-5">

            <div>

                <p className="text-xs tracking-[0.25em] text-cyan-400">

                    TOURNAMENT

                </p>

                <h1 className="mt-2 text-4xl font-black">

                    Results

                </h1>

            </div>

            {

                sections.length

                    ?

                    sections.map(

                        (
                            section,
                            index
                        ) => (

                            <Link

                                key={
                                    index
                                }

                                href={`/user/my-tournaments/${teamId}/results/${section.round._id}/${section.group._id}`}

                                className="block rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-6 transition hover:bg-cyan-500/15"

                            >

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-[10px] tracking-[0.25em] text-cyan-400">

                                            ROUND • GROUP

                                        </p>

                                        <h2 className="mt-2 text-2xl font-black">

                                            {

                                                section.round?.name

                                            }

                                        </h2>

                                        <p className="mt-2 text-gray-400">

                                            {

                                                section.group?.name

                                            }

                                        </p>

                                    </div>

                                    <div className="text-right">

                                        <div className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold">

                                            {

                                                section.matchCount

                                            }

                                            {" "}

                                            Matches

                                        </div>

                                        <p className="mt-3 text-2xl">

                                            →

                                        </p>

                                    </div>

                                </div>

                            </Link>

                        )

                    )

                    :

                    (

                        <div className="rounded-3xl bg-white/[0.03] p-10 text-center text-gray-400">

                            No Results Available

                        </div>

                    )

            }

        </div>

    );

}
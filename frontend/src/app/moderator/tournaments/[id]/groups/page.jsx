"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    useRouter,
    useParams,
} from "next/navigation";

import API
    from "@/lib/axios";

export default function TournamentGroupsPage() {

    const router =
        useRouter();

    const {
        id,
    }
        =
        useParams();

    const [
        groups,
        setGroups,
    ]
        =
        useState([]);

    const [
        loading,
        setLoading,
    ]
        =
        useState(true);

    useEffect(() => {

        fetchGroups();

    }, [id]);

    const fetchGroups =
        async () => {

            try {

                const res =
                    await API.get(
                        "/moderator/groups"
                    );

                const filtered =

                    res.data.data.filter(
                        group =>

                            group
                                .tournament
                                ?._id ===

                            id
                    );

                setGroups(
                    filtered
                );

            }

            catch (
            error
            ) {

                console.log(
                    error
                );

            }

            finally {

                setLoading(
                    false
                );

            }

        };

    if (
        loading
    ) {

        return (

            <div>

                Loading...

            </div>

        );

    }

    return (

        <div>

            <h1
                className="text-5xl font-black"
            >

                {

                    groups[0]
                        ?.tournament
                        ?.name ||

                    "Tournament"

                }

            </h1>

            <p
                className="mt-2 text-gray-500"
            >

                Assigned Groups

            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-10">

                {

                    groups.map(
                        group => (

                            <button

                                key={
                                    group._id
                                }

                                onClick={() =>

                                    router.push(

                                        `/moderator/groups/${group._id}`

                                    )

                                }

                                className="group h-[260px] rounded-[2rem] border border-cyan-500/20 bg-gradient-to-br from-[#0d0d0d] via-[#111] to-black p-8 text-left transition hover:border-cyan-500/60 hover:-translate-y-1"

                            >

                                <div className="h-full flex flex-col justify-between">

                                    <div>

                                        <h2
                                            className="text-3xl font-black"
                                        >

                                            {
                                                group.name
                                            }

                                        </h2>

                                    </div>

                                    <div>

                                        <p
                                            className="text-gray-500"
                                        >

                                            Round

                                        </p>

                                        <p
                                            className="text-2xl font-bold"
                                        >

                                            {

                                                group
                                                    .round
                                                    ?.name ||

                                                "—"

                                            }

                                        </p>

                                    </div>

                                    <div>

                                        <p
                                            className="text-gray-500"
                                        >

                                            Teams

                                        </p>

                                        <p
                                            className="text-2xl font-bold"
                                        >

                                            {

                                                group
                                                    .teams
                                                    ?.length ||

                                                0

                                            }

                                        </p>

                                    </div>

                                </div>

                            </button>

                        )

                    )

                }

            </div>

        </div>

    );

}
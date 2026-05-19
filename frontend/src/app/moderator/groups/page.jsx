"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    useRouter,
}
    from "next/navigation";

import API
    from "@/lib/axios";

export default function ModeratorGroupsPage() {

    const [
        groups,
        setGroups,
    ] = useState([]);

    const router =
        useRouter();

    const [
        loading,
        setLoading,
    ] = useState(true);

    useEffect(() => {

        fetchGroups();

    }, []);

    const fetchGroups =
        async () => {

            try {

                const res =
                    await API.get(
                        "/moderator/groups"
                    );

                setGroups(
                    res.data.data
                );

            }

            catch (error) {

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

    if (loading) {

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

                My Groups

            </h1>

            <div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-8"
            >

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

                                className="group h-[290px] rounded-[2rem] border border-cyan-500/20 bg-gradient-to-br from-[#0d0d0d] via-[#111] to-black p-8 transition hover:border-cyan-500/60 hover:-translate-y-1 text-left"

                            >

                                <div className="h-full flex flex-col justify-between">

                                    <div>

                                        <h2
                                            className="text-3xl font-black leading-tight"
                                        >

                                            {

                                                group
                                                    .tournament
                                                    ?.name ||

                                                "Tournament"

                                            }

                                        </h2>

                                    </div>

                                    <div className="space-y-4">

                                        <div>

                                            <p
                                                className="text-gray-500 text-sm"
                                            >

                                                Group

                                            </p>

                                            <p
                                                className="text-xl font-bold"
                                            >

                                                {
                                                    group.name
                                                }

                                            </p>

                                        </div>

                                        <div>

                                            <p
                                                className="text-gray-500 text-sm"
                                            >

                                                Round

                                            </p>

                                            <p
                                                className="text-xl font-bold"
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
                                                className="text-gray-500 text-sm"
                                            >

                                                Teams

                                            </p>

                                            <p
                                                className="text-xl font-bold"
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

                                    {/* <div>

                                        <button

                                            onClick={() =>

                                                router.push(
                                                    "/moderator/groups"
                                                )

                                            }

                                            className="text-cyan-400 hover:text-cyan-300 font-semibold"

                                        >

                                            Open →

                                        </button>

                                    </div> */}

                                </div>

                            </button>

                        )

                    )

                }

            </div>

        </div>

    );

}
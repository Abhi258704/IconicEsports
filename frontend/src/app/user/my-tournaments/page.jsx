"use client";

import {
    useEffect,
    useState,
} from "react";

import Link
    from "next/link";

import Image
    from "next/image";

import API
    from "@/lib/axios";

import toast
    from "react-hot-toast";

export default function MyTournamentsPage() {

    const [
        teams,
        setTeams
    ] =
        useState([]);

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
                            "/users/my-teams"
                        );

                    setTeams(

                        res.data.data

                        ||

                        []

                    );

                }

                catch {

                    toast.error(
                        "Failed to load"
                    );

                }

                finally {

                    setLoading(
                        false
                    );

                }

            };

        fetchData();

    }, []);

    if (
        loading
    ) {

        return (

            <div className="p-5">

                Loading...

            </div>

        );

    }

    return (

        <div className="mx-auto max-w-7xl p-5">

            <div>

                <p className="uppercase text-cyan-400">

                    My

                </p>

                <h1 className="mt-2 text-5xl font-black">

                    Tournaments

                </h1>

            </div>

            {

                teams.length === 0 && (

                    <div className="mt-20 text-center">

                        <p className="text-gray-500">

                            No registrations

                        </p>

                    </div>

                )

            }

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                {

                    teams.map(

                        (team) => (

                            <Link

                                key={
                                    team._id
                                }

                                href={`/user/my-tournaments/${team._id}`}

                                className="overflow-hidden rounded-[2rem] bg-[#0d0d0d]"

                            >

                                <div className="relative h-52">

                                    <Image

                                        fill

                                        src={
                                            team.tournament.banner
                                            ||

                                            "/logo1.png"
                                        }

                                        alt="banner"

                                        className="object-cover"

                                    />

                                </div>

                                <div className="space-y-3 p-5">

                                    <h2 className="text-3xl font-black">

                                        {
                                            team.teamName
                                        }

                                    </h2>

                                    <p className="text-gray-400">

                                        {
                                            team.tournament.name
                                        }

                                    </p>

                                    <div className="flex justify-between">

                                        <p>

                                            Status

                                        </p>

                                        <p

                                            className={

                                                team.status === "verified"

                                                    ?

                                                    "text-green-400"

                                                    :

                                                    team.status === "rejected"

                                                        ?

                                                        "text-red-400"

                                                        :

                                                        "text-yellow-400"

                                            }

                                        >

                                            {
                                                team.status
                                            }

                                        </p>

                                    </div>

                                </div>

                            </Link>

                        )

                    )

                }

            </div>

        </div>

    );

}
"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    useParams,
} from "next/navigation";

import Link
    from "next/link";

import Image
    from "next/image";

import API
    from "@/lib/axios";

import toast
    from "react-hot-toast";

export default function TournamentPage() {

    const {
        id
    } =
        useParams();

    const [
        loading,
        setLoading
    ] =
        useState(true);

    const [
        tournament,
        setTournament
    ] =
        useState(null);

    const [
        alreadyRegistered,
        setAlreadyRegistered
    ] =
        useState(false);

    useEffect(() => {

        const fetchData =
            async () => {

                try {

                    const res =

                        await API.get(

                            `/tournaments/${id}`

                        );

                    setTournament(

                        res.data.data
                            ?.tournament

                        ||

                        res.data.data

                    );



                    try {

                        const teamRes =

                            await API.get(

                                "/users/my-teams"

                            );

                        const exists =

                            teamRes.data.data.some(

                                team =>

                                    team.tournament?._id

                                    ===

                                    id

                            );

                        setAlreadyRegistered(
                            exists
                        );

                    }

                    catch { }

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

        if (
            id
        ) {

            fetchData();

        }

    }, [
        id
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
        !tournament
    ) {

        return null;

    }

    return (

        <div className="mx-auto max-w-4xl pb-24">

            <div className="relative h-56 overflow-hidden rounded-b-3xl">

                <Image

                    fill

                    src={
                        tournament.banner
                        ||
                        "/logo1.png"
                    }

                    alt={
                        tournament.name
                    }

                    className="object-cover"

                    priority

                />

            </div>

            <div className="p-5">

                <h1 className="text-4xl font-black">

                    {
                        tournament.name
                    }

                </h1>

                <p className="mt-3 text-gray-400">

                    {

                        tournament.description

                        ||

                        "Join tournament"

                    }

                </p>



                <div className="mt-8 space-y-4">

                    <div className="flex justify-between">

                        <span className="text-gray-500">

                            LAN Date

                        </span>

                        <span>

                            {

                                tournament.startDate

                                    ?

                                    new Date(
                                        tournament.startDate
                                    ).toLocaleDateString()

                                    :

                                    "Coming Soon"

                            }

                        </span>

                    </div>



                    <div className="flex justify-between">

                        <span className="text-gray-500">

                            Prize Pool

                        </span>

                        <span>

                            ₹{
                                tournament.prizePool
                                ||
                                0
                            }

                        </span>

                    </div>



                    <div className="flex justify-between">

                        <span className="text-gray-500">

                            Entry Fee

                        </span>

                        <span>

                            ₹{
                                tournament.entryFee
                                ||
                                0
                            }

                        </span>

                    </div>



                    {/* <div className="flex justify-between">

                        <span className="text-gray-500">

                            Teams

                        </span>

                        <span>

                            {
                                tournament.maxTeams
                            }

                        </span>

                    </div> */}



                    <div className="flex justify-between">

                        <span className="text-gray-500">

                            Team Size

                        </span>

                        <span>

                            {
                                tournament.teamSize
                            }

                        </span>

                    </div>

                </div>



                {

                    alreadyRegistered

                        ?

                        (

                            <button

                                disabled

                                className="mt-10 w-full rounded-xl bg-green-500/15 py-4 font-bold text-green-400"

                            >

                                Already Registered ✓

                            </button>

                        )

                        :

                        (

                            <Link

                                href={`/user/tournaments/${id}/register`}

                                className="mt-10 block w-full rounded-xl bg-cyan-500 py-4 text-center font-bold text-black"

                            >

                                Register

                            </Link>

                        )

                }

            </div>

        </div>

    );

}
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

export default function TournamentsPage() {

    const [
        loading,
        setLoading
    ] =
        useState(true);

    const [
        tournaments,
        setTournaments
    ] =
        useState([]);

    useEffect(() => {

        const fetchData =
            async () => {

                try {

                    const res =
                        await API.get(
                            "/tournaments"
                        );

                    setTournaments(

                        res.data.data
                            ?.tournaments

                        ||

                        res.data.data

                        ||

                        []

                    );

                }

                catch {

                    toast.error(
                        "Failed to load tournaments"
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

        <div className="mx-auto max-w-7xl space-y-10 p-6">

            <div>

                <p className="uppercase tracking-[0.2em] text-cyan-400">

                    Explore

                </p>

                <h1 className="mt-2 text-5xl font-black">

                    Tournaments

                </h1>

            </div>

            {

                tournaments.length > 0 && (

                    <Link

                        href={`/user/tournaments/${tournaments[0]._id}`}

                        className="block overflow-hidden rounded-[2rem] border border-cyan-500/10"

                    >

                        <div className="relative h-[220px] lg:h-[320px]">

                            <Image

                                fill

                                src={
                                    tournaments[0].banner
                                    ||
                                    "/logo1.png"
                                }

                                alt="featured"

                                className="object-cover"

                                priority

                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black" />

                            <div className="absolute bottom-0 p-8">

                                <p className="text-cyan-400">

                                    Featured Tournament

                                </p>

                                <h2 className="mt-2 text-5xl font-black">

                                    {
                                        tournaments[0].name
                                    }

                                </h2>

                            </div>

                        </div>

                    </Link>

                )

            }

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                {

                    tournaments.map(

                        (t) => (

                            <Link

                                key={
                                    t._id
                                }

                                href={`/user/tournaments/${t._id}`}

                                className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0d0d] transition hover:border-cyan-500/20"

                            >

                                <div className="relative h-52">

                                    <Image

                                        fill

                                        src={
                                            t.banner
                                            ||
                                            "/logo1.png"
                                        }

                                        alt={
                                            t.name
                                        }

                                        className="object-cover transition duration-500 group-hover:scale-[1.03]"

                                    />

                                </div>

                                <div className="space-y-3 p-5">

                                    <h2 className="line-clamp-2 text-3xl font-black">

                                        {
                                            t.name
                                        }

                                    </h2>

                                    <div className="flex items-center justify-between">

                                        <p className="text-sm text-gray-400">

                                            Prize

                                            <span className="ml-2 font-semibold text-cyan-400">

                                                ₹{
                                                    t.prizePool
                                                    ||
                                                    0
                                                }

                                            </span>

                                        </p>

                                        <p className="text-sm font-semibold text-cyan-400 transition group-hover:translate-x-1">

                                            Register →

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
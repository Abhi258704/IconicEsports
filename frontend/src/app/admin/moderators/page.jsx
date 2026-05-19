"use client";

import {
    useEffect,
    useState,
} from "react";

import Link
    from "next/link";

import axios
    from "@/lib/axios";

import toast
    from "react-hot-toast";

import {
    Shield,
    ChevronRight,
} from "lucide-react";

export default function ModeratorsPage() {

    const [
        moderators,
        setModerators
    ] =
        useState([]);

    const [
        loading,
        setLoading
    ] =
        useState(true);

    const fetchModerators =
        async () => {

            try {

                const res =
                    await axios.get(
                        "/users/moderators"
                    );

                setModerators(
                    res.data.data
                );

            }

            catch (error) {

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

    useEffect(() => {

        fetchModerators();

    }, []);

    if (
        loading
    ) {

        return (

            <div className="min-h-screen flex items-center justify-center">

                Loading...

            </div>

        );

    }

    return (

        <div className="space-y-8">

            <div>

                <p className="uppercase text-cyan-400">

                    Moderator Management

                </p>

                <h1 className="text-5xl font-black">

                    Moderators

                </h1>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                {

                    moderators.map(

                        (mod) => (

                            <Link

                                key={mod._id}

                                href={`/admin/moderators/${mod._id}`}

                                className="rounded-3xl border border-cyan-500/20 bg-white/[0.03] p-8 transition hover:-translate-y-1 hover:border-cyan-400"

                            >

                                <div className="flex justify-between">

                                    <div>

                                        <h2 className="text-3xl font-black">

                                            {mod.name}

                                        </h2>

                                        <p className="mt-2 text-gray-400">

                                            {mod.email}

                                        </p>

                                    </div>

                                    <Shield
                                        className="text-cyan-400"
                                    />

                                </div>

                                <div className="mt-8 flex justify-end">

                                    <ChevronRight />

                                </div>

                            </Link>

                        )

                    )

                }

            </div>

        </div>

    );

}
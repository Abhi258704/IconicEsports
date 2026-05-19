"use client";

import {
    useState,
} from "react";

import axios from "@/lib/axios";

import toast from "react-hot-toast";

import {
    Search,
    Shield,
    User,
} from "lucide-react";

export default function UsersPage() {

    const [
        email,
        setEmail
    ] =
        useState("");

    const [
        user,
        setUser
    ] =
        useState(null);

    const [
        loading,
        setLoading
    ] =
        useState(false);

    const searchUser =
        async () => {

            if (
                !email.trim()
            ) {

                toast.error(
                    "Enter email"
                );

                return;

            }

            try {

                setLoading(true);

                const res =
                    await axios.get(

                        `/users/search?email=${email}`

                    );

                setUser(
                    res.data.data
                );

            }

            catch (error) {

                setUser(null);

                toast.error(

                    error?.response?.data?.message ||

                    "User not found"

                );

            }

            finally {

                setLoading(false);

            }

        };

    const updateRole =
        async (
            role
        ) => {

            try {

                await axios.patch(

                    `/users/${user._id}/role`,

                    {
                        role
                    }

                );

                toast.success(

                    role ===
                        "moderator"

                        ?

                        "Promoted"

                        :

                        "Demoted"

                );

                setUser({

                    ...user,

                    role,

                });

            }

            catch (error) {

                toast.error(

                    error?.response?.data?.message ||

                    "Failed"

                );

            }

        };

    return (

        <div className="space-y-8">

            <div>

                <p className="uppercase text-cyan-400">

                    User Management

                </p>

                <h1 className="text-5xl font-black">

                    Users

                </h1>

            </div>

            <div className="rounded-3xl border border-cyan-500/20 bg-white/[0.03] p-6">

                <div className="flex gap-4">

                    <input

                        value={email}

                        onChange={
                            (e) =>

                                setEmail(
                                    e.target.value
                                )

                        }

                        placeholder="Search by email"

                        className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"

                    />

                    <button

                        onClick={
                            searchUser
                        }

                        disabled={
                            loading
                        }

                        className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4"

                    >

                        <Search />

                    </button>

                </div>

            </div>

            {

                user && (

                    <div className="rounded-3xl border border-cyan-500/20 bg-white/[0.03] p-8">

                        <div className="flex justify-between">

                            <div>

                                <h2 className="text-3xl font-black">

                                    {user.name}

                                </h2>

                                <p className="text-gray-400">

                                    {user.email}

                                </p>

                            </div>

                            <div className="rounded-2xl px-4 py-2 bg-cyan-500/20">

                                {user.role}

                            </div>

                        </div>

                        <div className="mt-8">

                            {

                                user.role !==
                                "admin"

                                &&

                                (

                                    <button

                                        onClick={() =>

                                            updateRole(

                                                user.role ===
                                                    "user"

                                                    ?

                                                    "moderator"

                                                    :

                                                    "user"

                                            )

                                        }

                                        className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 font-bold"

                                    >

                                        {

                                            user.role ===
                                                "user"

                                                ?

                                                "Promote"

                                                :

                                                "Demote"

                                        }

                                    </button>

                                )

                            }

                        </div>

                    </div>

                )

            }

        </div>

    );

}
"use client";

import {
    useState,
} from "react";

import {
    useParams,
    useRouter,
} from "next/navigation";

import API
    from "@/lib/axios";

import toast
    from "react-hot-toast";

export default function RegisterPage() {

    const {
        id
    } =
        useParams();

    const router =
        useRouter();

    const [
        registering,
        setRegistering
    ] =
        useState(false);

    const [
        form,
        setForm
    ] =
        useState({

            teamName: "",

            leaderName: "",

            leaderPhone: "",

            players:

                Array(5)

                    .fill()

                    .map(

                        () => ({

                            ign: "",

                            uid: "",

                            phone: "",

                        })

                    ),

        });

    const updatePlayer =

        (
            index,
            field,
            value
        ) => {

            setForm(

                prev => ({

                    ...prev,

                    players:

                        prev.players.map(

                            (
                                p,
                                i
                            ) =>

                                i === index

                                    ?

                                    {

                                        ...p,

                                        [field]:

                                            value,

                                    }

                                    :

                                    p

                        ),

                })

            );

        };

    const register =
        async () => {

            const required =

                form.players
                    .slice(
                        0,
                        4
                    );

            const invalid =

                required.some(

                    p =>

                        !p.ign

                        ||

                        !p.uid

                        ||

                        !p.phone

                );

            if (
                invalid
            ) {

                return toast.error(
                    "Fill first 4 players"
                );

            }

            try {

                setRegistering(
                    true
                );

                await API.post(

                    "/teams/register",

                    {

                        ...form,

                        players:

                            form.players.filter(

                                p =>

                                    p.ign

                                    ||

                                    p.uid

                                    ||

                                    p.phone

                            ),

                        tournamentId:
                            id,

                    }

                );

                toast.success(
                    "Registered");

                router.push(
                    "/user/my-tournaments"
                );

            }

            catch (
            err
            ) {

                toast.error(

                    err?.response
                        ?.data
                        ?.message

                    ||

                    "Failed"

                );

            }

            finally {

                setRegistering(
                    false
                );

            }

        };

    return (

        <div className="mx-auto max-w-3xl p-5">

            <h1 className="text-4xl font-black">

                Register Team

            </h1>

            <div className="mt-8 space-y-4">

                <input

                    placeholder="Team Name"

                    value={
                        form.teamName
                    }

                    onChange={
                        e =>

                            setForm({

                                ...form,

                                teamName:
                                    e.target.value,

                            })

                    }

                    className="w-full rounded-xl bg-[#0d0d0d] p-4"

                />

                <input

                    placeholder="Leader Name"

                    value={
                        form.leaderName
                    }

                    onChange={
                        e =>

                            setForm({

                                ...form,

                                leaderName:
                                    e.target.value,

                            })

                    }

                    className="w-full rounded-xl bg-[#0d0d0d] p-4"

                />

                <input

                    placeholder="Leader Phone"

                    value={
                        form.leaderPhone
                    }

                    onChange={
                        e =>

                            setForm({

                                ...form,

                                leaderPhone:
                                    e.target.value,

                            })

                    }

                    className="w-full rounded-xl bg-[#0d0d0d] p-4"

                />

                {

                    form.players.map(

                        (
                            player,
                            index
                        ) => (

                            <div

                                key={
                                    index
                                }

                                className="rounded-2xl bg-[#0d0d0d] p-5"

                            >

                                <p className="mb-4 text-lg font-bold">

                                    Player {

                                        index + 1

                                    }

                                    {

                                        index === 4

                                        &&

                                        " (Optional)"

                                    }

                                </p>

                                <div className="space-y-3">

                                    <input

                                        placeholder="IGN"

                                        value={
                                            player.ign
                                        }

                                        onChange={
                                            e =>

                                                updatePlayer(

                                                    index,

                                                    "ign",

                                                    e.target.value

                                                )

                                        }

                                        className="w-full rounded-xl bg-black p-4"

                                    />

                                    <input

                                        placeholder="UID"

                                        value={
                                            player.uid
                                        }

                                        onChange={
                                            e =>

                                                updatePlayer(

                                                    index,

                                                    "uid",

                                                    e.target.value

                                                )

                                        }

                                        className="w-full rounded-xl bg-black p-4"

                                    />

                                    <input

                                        placeholder="Phone"

                                        value={
                                            player.phone
                                        }

                                        onChange={
                                            e =>

                                                updatePlayer(

                                                    index,

                                                    "phone",

                                                    e.target.value

                                                )

                                        }

                                        className="w-full rounded-xl bg-black p-4"

                                    />

                                </div>

                            </div>

                        )

                    )

                }

                <button

                    onClick={
                        register
                    }

                    disabled={
                        registering
                    }

                    className="w-full rounded-xl bg-cyan-500 py-4 font-bold text-black"

                >

                    {

                        registering

                            ?

                            "Registering"

                            :

                            "Register"

                    }

                </button>

            </div>

        </div>

    );

}
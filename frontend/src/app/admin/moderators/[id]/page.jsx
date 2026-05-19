"use client";

import {
    useEffect,
    useState,
} from "react";

import Link from "next/link";

import {
    useParams,
} from "next/navigation";

import API from "@/lib/axios";

import toast from "react-hot-toast";

import {
    ArrowLeft,
    Plus,
    Users,
    ChevronRight,
} from "lucide-react";

export default function ModeratorPage() {

    const {
        id
    } =
        useParams();

    const [
        moderator,
        setModerator
    ] =
        useState(null);

    const [
        loading,
        setLoading
    ] =
        useState(true);

    const [
        assigning,
        setAssigning
    ] =
        useState(false);

    const [
        tournaments,
        setTournaments
    ] =
        useState([]);

    const [
        rounds,
        setRounds
    ] =
        useState([]);

    const [
        groups,
        setGroups
    ] =
        useState([]);

    const [
        selectedTournament,
        setSelectedTournament
    ] =
        useState("");

    const [
        selectedRound,
        setSelectedRound
    ] =
        useState("");

    const [
        selectedGroup,
        setSelectedGroup
    ] =
        useState("");



    const fetchPage =
        async () => {

            try {

                const [

                    moderatorRes,

                    tournamentRes,

                ] =

                    await Promise.all([

                        API.get(
                            `/users/moderators/${id}`
                        ),

                        API.get(
                            "/tournaments"
                        ),

                    ]);

                setModerator(
                    moderatorRes.data.data
                );

                setTournaments(

                    tournamentRes
                        .data
                        .data

                    ||

                    []

                );

            }

            catch (error) {

                console.log(
                    error
                );

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

        if (id) {

            fetchPage();

        }

    }, [id]);



    const selectTournament =
        async (
            tournamentId
        ) => {

            setSelectedTournament(
                tournamentId
            );

            setSelectedRound("");

            setSelectedGroup("");

            setGroups([]);

            try {

                const res =
                    await API.get(

                        `/rounds/tournament/${tournamentId}`

                    );

                setRounds(
                    res.data.data
                );

            }

            catch {

                toast.error(
                    "Failed to load rounds"
                );

            }

        };



    const selectRound =
        async (
            roundId
        ) => {

            setSelectedRound(
                roundId
            );

            setSelectedGroup("");

            try {

                const res =
                    await API.get(

                        `/groups/round/${roundId}`

                    );

                const assigned =
                    new Set(

                        (

                            moderator
                                ?.assignedGroups

                            ||

                            []

                        )

                            .map(
                                g =>
                                    g._id
                            )

                    );

                const available =

                    (

                        res.data.data

                        ||

                        []

                    )

                        .filter(

                            g =>

                                !assigned.has(
                                    g._id
                                )

                        );

                setGroups(
                    available
                );

            }

            catch {

                toast.error(
                    "Failed to load groups"
                );

            }

        };



    const removeGroup =
        async (
            groupId
        ) => {

            try {

                // console.log(
                //     "REMOVING",
                //     groupId
                // );

                const res =
                    await API({

                        method:
                            "PATCH",

                        url:
                            `/groups/${groupId}/remove-moderator`,

                        data: {

                            moderatorId:
                                moderator._id

                        },

                    });

                // console.log(
                //     res.data
                // );

                toast.success(
                    "Removed"
                );

                await fetchPage();

            }

            catch (error) {

                console.log(
                    "FRONT ERR",
                    error
                );

                toast.error(

                    error?.response?.data?.message ||

                    error?.message ||

                    "Remove failed"

                );

            }

        };

    const assignGroup =
        async () => {

            if (
                !selectedGroup
            ) {

                return toast.error(
                    "Select group"
                );

            }

            try {

                setAssigning(
                    true
                );

                await API.patch(

                    `/groups/${selectedGroup}/assign-moderator`,

                    {

                        moderatorId:
                            moderator._id

                    }

                );

                toast.success(
                    "Assigned"
                );

                setSelectedGroup("");

                setSelectedRound("");

                setGroups([]);

                fetchPage();

            }

            catch (

            error

            ) {

                toast.error(

                    error?.response?.data?.message ||

                    "Assignment failed"

                );

            }

            finally {

                setAssigning(
                    false
                );

            }

        };



    if (
        loading
    ) {

        return (

            <div className="min-h-[70vh] flex items-center justify-center">

                Loading...

            </div>

        );

    }



    return (

        <div className="space-y-8">

            {/* HEADER */}

            <div className="rounded-3xl border border-cyan-500/20 bg-[#101010] p-8">

                <Link

                    href="/admin/moderators"

                    className="inline-flex items-center gap-2"

                >

                    <ArrowLeft />

                    Back

                </Link>

                <h1 className="mt-8 text-5xl font-black">

                    {moderator.name}

                </h1>

                <p className="mt-3 text-gray-400">

                    {moderator.email}

                </p>

            </div>



            {/* ASSIGN */}

            <div className="rounded-3xl border border-cyan-500/20 p-8">

                <h2 className="text-3xl font-black">

                    Assign Group

                </h2>

                <div className="mt-8 grid gap-4 lg:grid-cols-4">

                    <select

                        value={
                            selectedTournament
                        }

                        onChange={
                            e =>

                                selectTournament(
                                    e.target.value
                                )
                        }

                        className="rounded-2xl bg-black/30 p-4"

                    >

                        <option value="">

                            Tournament

                        </option>

                        {

                            tournaments.map(

                                t => (

                                    <option

                                        key={
                                            t._id
                                        }

                                        value={
                                            t._id
                                        }

                                    >

                                        {t.name}

                                    </option>

                                )

                            )

                        }

                    </select>



                    <select

                        value={
                            selectedRound
                        }

                        onChange={
                            e =>

                                selectRound(
                                    e.target.value
                                )
                        }

                        className="rounded-2xl bg-black/30 p-4"

                    >

                        <option value="">

                            Round

                        </option>

                        {

                            rounds.map(

                                r => (

                                    <option

                                        key={
                                            r._id
                                        }

                                        value={
                                            r._id
                                        }

                                    >

                                        {r.name}

                                    </option>

                                )

                            )

                        }

                    </select>



                    <select

                        disabled={
                            !selectedRound
                        }

                        value={
                            selectedGroup
                        }

                        onChange={
                            e =>

                                setSelectedGroup(
                                    e.target.value
                                )
                        }

                        className="rounded-2xl bg-black/30 p-4 disabled:opacity-50"

                    >

                        <option value="">

                            {

                                !selectedRound

                                    ?

                                    "Select Round"

                                    :

                                    groups.length === 0

                                        ?

                                        "No Groups Available"

                                        :

                                        "Select Group"

                            }

                        </option>

                        {

                            groups.map(

                                g => (

                                    <option

                                        key={
                                            g._id
                                        }

                                        value={
                                            g._id
                                        }

                                    >

                                        {g.name}

                                    </option>

                                )

                            )

                        }

                    </select>



                    <button

                        disabled={
                            assigning ||

                            !selectedGroup
                        }

                        onClick={
                            assignGroup
                        }

                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 px-8 py-4 font-black text-white transition duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"

                    >

                        <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-white/10" />

                        <div className="relative flex items-center justify-center gap-3">

                            {

                                assigning

                                    ?

                                    <>

                                        <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />

                                        Assigning...

                                    </>

                                    :

                                    <>

                                        <Plus size={18} />

                                        Assign Group

                                    </>

                            }

                        </div>

                    </button>

                </div>

            </div>



            {/* GROUPS */}

            <div>

                <h2 className="text-4xl font-black">

                    Assigned Groups

                </h2>

                {

                    moderator
                        .assignedGroups
                        ?.length ===
                        0

                        ?

                        (

                            <div className="mt-8 rounded-3xl border border-cyan-500/20 p-20 text-center">

                                <Users
                                    size={60}
                                    className="mx-auto"
                                />

                                <p className="mt-5">

                                    No Groups Assigned

                                </p>

                            </div>

                        )

                        :

                        (

                            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                                {

                                    moderator
                                        .assignedGroups
                                        .map(

                                            g => (

                                                <div

                                                    key={
                                                        g._id
                                                    }

                                                    className="group rounded-3xl border border-cyan-500/20 bg-white/[0.03] p-8 transition hover:border-cyan-500"

                                                >

                                                    <div className="flex justify-between">

                                                        <div>

                                                            <p className="text-cyan-400 text-xs uppercase">

                                                                Group

                                                            </p>

                                                            <h2 className="mt-2 text-4xl font-black">

                                                                {g.name}

                                                            </h2>

                                                        </div>

                                                        <button

                                                            onClick={() =>

                                                                removeGroup(
                                                                    g._id
                                                                )

                                                            }

                                                            className="rounded-2xl bg-red-500/10 px-5 py-3 text-red-400 transition hover:bg-red-500 hover:text-white"

                                                        >

                                                            Remove

                                                        </button>

                                                    </div>

                                                    <Link

                                                        href={`/admin/groups/${g._id}`}

                                                        className="mt-8 inline-flex items-center gap-2 text-cyan-400"

                                                    >

                                                        Open

                                                        <ChevronRight />

                                                    </Link>

                                                </div>

                                            )

                                        )

                                }

                            </div>

                        )

                }

            </div>

        </div>

    );

}
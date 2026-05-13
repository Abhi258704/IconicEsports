"use client";

import { useEffect, useState }
    from "react";

import { useParams }
    from "next/navigation";

import axios
    from "@/lib/axios";

import Link
    from "next/link";

import toast from "react-hot-toast";

import {
    Users,
    ArrowLeft,
} from "lucide-react";

export default function GroupPage() {

    const { id } =
        useParams();

    const [group, setGroup] =
        useState(null);

    const [allGroups, setAllGroups] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [selectionMode, setSelectionMode] =
        useState(false);

    const [selectedTeams, setSelectedTeams] =
        useState([]);

    const [targetGroup, setTargetGroup] =
        useState("");

    const [showConfirm, setShowConfirm] =
        useState(false);

    const [moving, setMoving] =
        useState(false);

    const fetchGroup =
        async () => {

            try {

                const res =
                    await axios.get(
                        `/groups/${id}`
                    );

                setGroup(
                    res.data.data
                );

                const groupsRes =
                    await axios.get(
                        `/rounds/${res.data.data.round._id}`
                    );

                setAllGroups(
                    groupsRes.data.data.groups || []
                );

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        };

    useEffect(() => {

        if (id) {

            fetchGroup();

        }

    }, [id]);

    const toggleTeamSelection =
        (teamId) => {

            const exists =
                selectedTeams.includes(
                    teamId
                );

            if (exists) {

                setSelectedTeams(
                    selectedTeams.filter(
                        (id) =>
                            id !== teamId
                    )
                );

            } else {

                setSelectedTeams(
                    [
                        ...selectedTeams,
                        teamId,
                    ]
                );

            }

        };

    const moveSelectedTeams =
        async () => {

            try {

                setMoving(true);

                await axios.patch(
                    "/groups/move-teams",
                    {
                        teamIds:
                            selectedTeams,

                        fromGroupId:
                            group._id,

                        toGroupId:
                            targetGroup,
                    }
                );

                setSelectedTeams([]);

                setTargetGroup("");

                setSelectionMode(false);

                setShowConfirm(false);

                toast.success(
                    `${selectedTeams.length} ${selectedTeams.length > 1
                        ? "teams"
                        : "team"
                    } moved successfully`
                );

                fetchGroup();

            } catch (error) {

                console.log(error);

            } finally {

                setMoving(false);

            }

        };

    if (loading) {

        return (

            <div className="min-h-[70vh] flex items-center justify-center">

                <div className="h-20 w-20 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />

            </div>

        );

    }

    if (!group) {

        return (

            <div className="min-h-[70vh] flex items-center justify-center text-white">

                Group not found

            </div>

        );

    }

    return (

        <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden">

            {/* HEADER */}

            <div className="flex flex-col gap-6">

                <Link
                    href={`/admin/rounds/${group.round?._id}`}
                    className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-gray-300 transition hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-white"
                >

                    <ArrowLeft size={18} />

                    Back

                </Link>

                <div>

                    <p className="uppercase tracking-[0.3em] text-sm text-cyan-400">
                        Group Management
                    </p>

                    <div className="mt-3 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

                        <div className="flex flex-col xl:flex-row xl:items-center gap-5">

                            <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 bg-clip-text text-transparent">

                                {group.name}

                            </h1>

                            <div className="flex flex-wrap gap-4">

                                <div className="rounded-2xl border border-cyan-500/20 bg-white/[0.03] px-5 py-3">

                                    <p className="text-xs text-gray-400">

                                        Teams

                                    </p>

                                    <h2 className="text-2xl font-black text-white">

                                        {group.teams?.length || 0}

                                    </h2>

                                </div>

                                <div className="rounded-2xl border border-purple-500/20 bg-white/[0.03] px-5 py-3">

                                    <p className="text-xs text-gray-400">

                                        Round

                                    </p>

                                    <h2 className="text-xl font-black text-white">

                                        {group.round?.name}

                                    </h2>

                                </div>

                                <Link
                                    href={`/admin/groups/${group._id}/slots`}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 font-bold text-white transition hover:scale-105"
                                >

                                    Manage Slots

                                </Link>

                                <button
                                    onClick={() => {

                                        if (selectionMode) {

                                            setSelectedTeams([]);

                                            setTargetGroup("");

                                        }

                                        setSelectionMode(
                                            !selectionMode
                                        );

                                    }}
                                    className={`inline-flex items-center gap-2 rounded-2xl px-6 py-4 font-bold text-white transition hover:scale-105 ${selectionMode
                                        ? "bg-gradient-to-r from-red-500 to-pink-500"
                                        : "bg-gradient-to-r from-purple-500 to-cyan-500"
                                        }`}
                                >

                                    {
                                        selectionMode
                                            ? "Cancel Move"
                                            : "Move Teams"
                                    }

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* SCROLL */}

            <div className="mt-8 flex-1 overflow-y-auto pr-2">

                {/* TEAMS */}

                <div className="mt-12">

                    <div>

                        <p className="uppercase tracking-[0.3em] text-xs text-cyan-400">
                            Team Management
                        </p>

                        <h2 className="mt-2 text-4xl font-black text-white">
                            Teams
                        </h2>

                    </div>

                    {
                        group.teams?.length === 0 ? (

                            <div className="mt-8 rounded-3xl border border-cyan-500/20 bg-white/[0.03] p-16 text-center">

                                <Users
                                    size={70}
                                    className="mx-auto text-cyan-400"
                                />

                                <h2 className="mt-6 text-3xl font-black text-white">
                                    No Teams Yet
                                </h2>

                                <p className="mt-3 text-gray-400">
                                    Teams will appear here after verification.
                                </p>

                            </div>

                        ) : (

                            <>

                                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                                    {
                                        group.teams?.map(
                                            (team) => (

                                                <div
                                                    key={team._id}
                                                    onClick={() => {

                                                        if (selectionMode) {

                                                            toggleTeamSelection(
                                                                team._id
                                                            );

                                                        }

                                                    }}
                                                    className={`rounded-3xl border p-8 transition ${selectionMode
                                                        ? "cursor-pointer"
                                                        : ""
                                                        } ${selectedTeams.includes(
                                                            team._id
                                                        )
                                                            ? "border-cyan-400 bg-cyan-500/10"
                                                            : "border-cyan-500/20 bg-white/[0.03]"
                                                        } hover:border-cyan-400/40 hover:bg-cyan-500/[0.05]`}
                                                >

                                                    {
                                                        selectionMode ? (

                                                            <div>

                                                                <div className="flex justify-end">

                                                                    <div
                                                                        className={`h-6 w-6 rounded-lg border-2 transition ${selectedTeams.includes(
                                                                            team._id
                                                                        )
                                                                            ? "border-cyan-400 bg-cyan-400"
                                                                            : "border-white/20"
                                                                            }`}
                                                                    />

                                                                </div>

                                                                <div className="flex items-start justify-between gap-4">

                                                                    <div>

                                                                        <p className="uppercase tracking-[0.25em] text-xs text-cyan-400">
                                                                            Team
                                                                        </p>

                                                                        <h2 className="mt-3 text-3xl font-black text-white">

                                                                            {team.teamName}

                                                                        </h2>

                                                                    </div>

                                                                    <div className="rounded-2xl bg-green-500/20 px-4 py-2 text-sm font-bold text-green-300">

                                                                        {team.status}

                                                                    </div>

                                                                </div>

                                                                <div className="mt-8 space-y-3 text-gray-300">

                                                                    <p>

                                                                        Leader:
                                                                        {" "}

                                                                        {team.leaderName}

                                                                    </p>

                                                                    <p>

                                                                        Phone:
                                                                        {" "}

                                                                        {team.leaderPhone}

                                                                    </p>

                                                                </div>

                                                            </div>

                                                        ) : (

                                                            <Link
                                                                href={`/admin/teams/${team._id}?from=group&groupId=${group._id}`}
                                                            >

                                                                <div className="flex items-start justify-between gap-4">

                                                                    <div>

                                                                        <p className="uppercase tracking-[0.25em] text-xs text-cyan-400">
                                                                            Team
                                                                        </p>

                                                                        <h2 className="mt-3 text-3xl font-black text-white">

                                                                            {team.teamName}

                                                                        </h2>

                                                                    </div>

                                                                    <div className="rounded-2xl bg-green-500/20 px-4 py-2 text-sm font-bold text-green-300">

                                                                        {team.status}

                                                                    </div>

                                                                </div>

                                                                <div className="mt-8 space-y-3 text-gray-300">

                                                                    <p>

                                                                        Leader:
                                                                        {" "}

                                                                        {team.leaderName}

                                                                    </p>

                                                                    <p>

                                                                        Phone:
                                                                        {" "}

                                                                        {team.leaderPhone}

                                                                    </p>

                                                                </div>

                                                            </Link>

                                                        )
                                                    }

                                                </div>

                                            )
                                        )
                                    }

                                </div>

                                {
                                    selectionMode && (

                                        <div className="sticky bottom-0 mt-10 flex items-center gap-4 rounded-3xl border border-cyan-500/20 bg-[#0a0a0a]/95 p-6 backdrop-blur-xl">

                                            <select
                                                value={targetGroup}
                                                onChange={(e) =>
                                                    setTargetGroup(
                                                        e.target.value
                                                    )
                                                }
                                                className="rounded-2xl border border-cyan-500/20 bg-black/40 px-5 py-4 text-white outline-none"
                                            >

                                                <option value="">

                                                    Select Group

                                                </option>

                                                {
                                                    allGroups
                                                        .filter(
                                                            (g) =>
                                                                g._id !==
                                                                group._id
                                                        )
                                                        .map((g) => (

                                                            <option
                                                                key={g._id}
                                                                value={g._id}
                                                            >

                                                                {g.name}

                                                            </option>

                                                        ))
                                                }

                                            </select>

                                            <button
                                                disabled={
                                                    !targetGroup ||
                                                    selectedTeams.length === 0
                                                }
                                                onClick={() =>
                                                    setShowConfirm(true)
                                                }
                                                className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 font-bold text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                                            >

                                                Move Selected

                                            </button>

                                        </div>

                                    )
                                }

                            </>

                        )
                    }

                </div>

            </div>

            {
                showConfirm && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

                        <div className="w-full max-w-md rounded-3xl border border-cyan-500/20 bg-[#0a0a0a] p-8">

                            <h2 className="text-3xl font-black text-white">

                                Confirm Move

                            </h2>

                            <p className="mt-4 text-gray-400">

                                Move
                                {" "}
                                {selectedTeams.length}
                                {" "}
                                teams to selected group?

                            </p>

                            <div className="mt-8 flex gap-4">

                                <button
                                    onClick={() =>
                                        setShowConfirm(false)
                                    }
                                    className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 font-bold text-white"
                                >

                                    Cancel

                                </button>

                                <button
                                    disabled={moving}
                                    onClick={moveSelectedTeams}
                                    className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 font-bold text-white disabled:opacity-50"
                                >

                                    {
                                        moving
                                            ? "Moving..."
                                            : "Confirm"
                                    }

                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

        </div>

    );

}
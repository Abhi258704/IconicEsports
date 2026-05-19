"use client";

import {
    useEffect,
    useState,
} from "react";

import Link from "next/link";

import {
    useParams,
} from "next/navigation";

import axios from "@/lib/axios";

import toast from "react-hot-toast";

import {
    ArrowLeft,
    Trophy,
    Medal,
    Target,
    Swords,
    ShieldCheck,
    Loader2,
    ChevronRight,
} from "lucide-react";

export default function GroupLeaderboardPage() {

    const { id } =
        useParams();

    const [group,
        setGroup] =
        useState(null);

    // const [
    //     showRollbackModal,
    //     setShowRollbackModal
    // ] = useState(false);

    const [leaderboard,
        setLeaderboard] =
        useState([]);

    const [loading,
        setLoading] =
        useState(true);

    const [
        showMoveModal,
        setShowMoveModal
    ] = useState(false);

    const [
        showConfirmModal,
        setShowConfirmModal
    ] = useState(false);

    const [
        selectedTeams,
        setSelectedTeams
    ] = useState([]);

    const [
        nextRound,
        setNextRound
    ] = useState(null);

    const [
        movingTeams,
        setMovingTeams
    ] = useState(false);

    const fetchLeaderboard =
        async () => {

            try {

                const [
                    groupRes,
                    leaderboardRes,
                ] = await Promise.all([

                    axios.get(
                        `/groups/${id}`
                    ),

                    axios.get(
                        `/groups/${id}/leaderboard`
                    ),

                ]);

                setGroup(
                    groupRes.data.data
                );

                setLeaderboard(
                    leaderboardRes.data.data
                );

            } catch (error) {

                console.log(error);

                toast.error(
                    "Failed to load leaderboard"
                );

            } finally {

                setLoading(false);

            }

        };

    useEffect(() => {

        if (id) {

            fetchLeaderboard();

        }

    }, [id]);

    const openMoveModal =
        async () => {

            const qualificationCount =
                group?.round?.qualificationCount || 0;

            const autoSelected =
                leaderboard
                    .slice(
                        0,
                        qualificationCount
                    )
                    .map(
                        item => item.team._id
                    );

            setSelectedTeams(
                autoSelected
            );

            try {

                const res =
                    await axios.get(
                        `/rounds/next/${group.round._id}`
                    );

                setNextRound(
                    res.data.data
                );

            } catch (error) {

                setNextRound(null);

            }

            setShowMoveModal(
                true
            );

        };

    const toggleTeam = (teamId) => {

        const qualificationCount =
            group?.round?.qualificationCount || 0;

        const alreadySelected =
            selectedTeams.includes(teamId);

        if (alreadySelected) {

            setSelectedTeams(prev =>
                prev.filter(
                    id => id !== teamId
                )
            );

            return;

        }

        if (
            selectedTeams.length >=
            qualificationCount
        ) {

            toast.error(
                `Only ${qualificationCount} teams can qualify`,
                {
                    id: "qualification-limit"
                }
            );

            return;

        }

        setSelectedTeams(prev => [
            ...prev,
            teamId
        ]);

    };

    const moveTeams =
        async () => {

            try {

                setMovingTeams(true);

                await axios.post(
                    `/groups/${group._id}/move-to-next-round`,
                    {

                        nextRoundId:
                            nextRound._id,

                        selectedTeamIds:
                            selectedTeams,

                    }
                );

                toast.success(
                    "Teams moved successfully"
                );

                setShowConfirmModal(
                    false
                );

                setShowMoveModal(
                    false
                );

                fetchLeaderboard();

            } catch (error) {

                console.log(error);

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to move teams"
                );

            } finally {

                setMovingTeams(false);

            }

        };

    // const rollbackQualification =
    //     async () => {

    //         try {

    //             // const confirmRollback =
    //             //    window.confirm(
    //             //       "Rollback qualification?"
    //             //    );

    //             // if (
    //             //    !confirmRollback
    //             // ) return;

    //             await axios.post(
    //                 `/groups/${group._id}/rollback-qualification`
    //             );

    //             toast.success(
    //                 "Qualification rolled back"
    //             );

    //             fetchLeaderboard();

    //         } catch (error) {

    //             console.log(error);

    //             toast.error(
    //                 error?.response?.data?.message ||
    //                 "Rollback failed"
    //             );

    //         }

    //     };

    if (loading) {

        return (

            <div className="flex min-h-[70vh] items-center justify-center">

                <div className="flex items-center gap-4 rounded-3xl border border-green-500/20 bg-[#111111] px-8 py-6 text-white">

                    <Loader2
                        size={28}
                        className="animate-spin text-green-400"
                    />

                    <div>

                        <p className="text-sm uppercase tracking-[0.25em] text-green-400">

                            Loading

                        </p>

                        <h2 className="mt-1 text-xl font-black">

                            Fetching Leaderboard

                        </h2>

                    </div>

                </div>

            </div>

        );

    }

    return (

        <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden text-white">

            {/* HEADER */}

            <div className="rounded-3xl border border-green-500/20 bg-gradient-to-br from-[#111111] to-[#0a0a0a] px-8 py-6 shadow-[0_0_40px_rgba(34,197,94,0.10)]">

                <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

                    <div>

                        <Link
                            href={`/moderator/groups/${id}/matches`}
                            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-gray-300 transition hover:border-green-500/30 hover:bg-green-500/10 hover:text-white"
                        >

                            <ArrowLeft size={18} />

                            Back To Matches

                        </Link>

                        <h1 className="mt-5 flex flex-wrap items-center gap-4 text-4xl font-black">

                            <span className="bg-gradient-to-r from-green-300 via-emerald-400 to-green-500 bg-clip-text text-transparent">

                                {group?.name}

                            </span>

                            <span className="text-xl text-gray-400">

                                • {group?.round?.name}

                            </span>

                        </h1>

                    </div>

                    {

                        !group?.qualificationLocked

                            ?

                            (

                                <button

                                    onClick={
                                        openMoveModal
                                    }

                                    className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 font-bold text-white transition hover:scale-105"

                                >

                                    <ChevronRight
                                        size={20}
                                    />

                                    Move To Next Round

                                </button>

                            )

                            :

                            (

                                <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-6 py-4 font-bold text-green-300">

                                    Qualification Locked

                                </div>

                            )

                    }

                </div>

            </div>

            {/* TABLE */}

            <div className="mt-5 flex-1 overflow-hidden rounded-3xl border border-white/10 bg-[#111111]">

                {
                    leaderboard.length === 0 ? (

                        <div className="flex h-full flex-col items-center justify-center px-6 text-center">

                            <Trophy
                                size={80}
                                className="text-green-400"
                            />

                            <h2 className="mt-6 text-4xl font-black text-white">

                                No Results Yet

                            </h2>

                            <p className="mt-4 max-w-xl text-gray-400">

                                Complete match result submissions to generate the leaderboard.

                            </p>

                        </div>

                    ) : (

                        <div className="h-full overflow-y-auto">

                            <table className="w-full min-w-[950px] border-collapse">

                                <thead className="sticky top-0 z-20 border-b border-white/10 bg-[#0d0d0d] backdrop-blur-xl">

                                    <tr>

                                        <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-[0.2em] text-green-400">

                                            Rank

                                        </th>

                                        <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-[0.2em] text-green-400">

                                            Team

                                        </th>

                                        <th className="px-6 py-5 text-center text-sm font-bold uppercase tracking-[0.2em] text-green-400">

                                            Matches

                                        </th>

                                        <th className="px-6 py-5 text-center text-sm font-bold uppercase tracking-[0.2em] text-green-400">

                                            Placement

                                        </th>

                                        <th className="px-6 py-5 text-center text-sm font-bold uppercase tracking-[0.2em] text-green-400">

                                            Kills

                                        </th>

                                        <th className="px-6 py-5 text-center text-sm font-bold uppercase tracking-[0.2em] text-green-400">

                                            Total Points

                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {
                                        leaderboard.map(
                                            (
                                                item,
                                                index
                                            ) => {

                                                const qualificationCount =
                                                    group?.round?.qualificationCount || 0;

                                                const isQualified =
                                                    index < qualificationCount;

                                                return (

                                                    <tr
                                                        key={item._id}
                                                        className={`border-b border-white/5 transition hover:bg-white/[0.03]
                                             ${isQualified
                                                                ? "bg-green-500/[0.08]"
                                                                : ""
                                                            }`}
                                                    >

                                                        <td className="px-6 py-5">

                                                            {
                                                                index === 0 ? (

                                                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500/15 text-yellow-300 shadow-[0_0_30px_rgba(234,179,8,0.18)]">

                                                                        <Trophy size={26} />

                                                                    </div>

                                                                ) : index === 1 ? (

                                                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-500/15 text-gray-300">

                                                                        <Medal size={24} />

                                                                    </div>

                                                                ) : index === 2 ? (

                                                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-700/20 text-orange-300">

                                                                        <Medal size={24} />

                                                                    </div>

                                                                ) : (

                                                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-xl font-black text-white">

                                                                        #{index + 1}

                                                                    </div>

                                                                )
                                                            }

                                                        </td>

                                                        <td className="px-6 py-5">

                                                            <div>

                                                                <Link
                                                                    href={`/moderator/teams/${item.team._id}?from=group&groupId=${group._id}`}
                                                                    target="_blank"
                                                                    className="text-xl font-black text-white transition hover:text-green-400"
                                                                >

                                                                    {item.team.teamName}

                                                                </Link>

                                                                <p className="mt-2 text-sm text-gray-400">

                                                                    Leader: {item.team.leaderName}

                                                                </p>

                                                            </div>

                                                        </td>

                                                        <td className="px-6 py-5 text-center">

                                                            <div className="inline-flex min-w-[100px] items-center justify-center gap-2 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 font-black text-cyan-300">

                                                                <ShieldCheck size={18} />

                                                                {item.matchesPlayed}

                                                            </div>

                                                        </td>

                                                        <td className="px-6 py-5 text-center">

                                                            <div className="inline-flex min-w-[120px] items-center justify-center gap-2 rounded-2xl border border-purple-500/20 bg-purple-500/10 px-4 py-3 font-black text-purple-300">

                                                                <Target size={18} />

                                                                {item.totalPlacementPoints}

                                                            </div>

                                                        </td>

                                                        <td className="px-6 py-5 text-center">

                                                            <div className="inline-flex min-w-[110px] items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 font-black text-red-300">

                                                                <Swords size={18} />

                                                                {item.totalKills}

                                                            </div>

                                                        </td>

                                                        <td className="px-6 py-5 text-center">

                                                            <div className="inline-flex min-w-[140px] items-center justify-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-4 font-black text-green-300">

                                                                <Trophy size={20} />

                                                                {item.totalPoints}

                                                            </div>

                                                        </td>

                                                    </tr>

                                                );

                                            }
                                        )
                                    }

                                </tbody>

                            </table>

                        </div>

                    )
                }

            </div>

            {/* {
                showRollbackModal && (

                    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-5">

                        <div className="w-full max-w-xl rounded-3xl border border-red-500/20 bg-[#111111] p-8">

                            <p className="text-sm uppercase tracking-[0.25em] text-red-400">

                                Dangerous Action

                            </p>

                            <h2 className="mt-4 text-4xl font-black text-white">

                                Rollback Qualification?

                            </h2>

                            <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-5">

                                <p className="leading-relaxed text-red-200">

                                    This will remove all qualified teams
                                    from the next round and unlock
                                    qualification for this group.

                                </p>

                                <p className="mt-4 font-bold text-red-400">

                                    Use this only if qualification was done incorrectly.

                                </p>

                            </div>

                            <div className="mt-8 space-y-3 text-gray-400">

                                <p>
                                    • Teams will be removed from next round groups
                                </p>

                                <p>
                                    • Qualification lock will be removed
                                </p>

                                <p>
                                    • Empty next round groups may be deleted
                                </p>

                                <p className="text-red-400 font-bold">
                                    • Cannot be used if next round already started
                                </p>

                            </div>

                            <div className="mt-10 flex gap-4">

                                <button
                                    onClick={() =>
                                        setShowRollbackModal(false)
                                    }
                                    className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 font-bold text-gray-300"
                                >

                                    Cancel

                                </button>

                                <button
                                    onClick={async () => {

                                        await rollbackQualification();

                                        setShowRollbackModal(false);

                                    }}
                                    className="flex-1 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 px-5 py-4 font-bold text-white transition hover:scale-105"
                                >

                                    Confirm Rollback

                                </button>

                            </div>

                        </div>

                    </div>

                )
            } */}

            {
                showMoveModal && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-5">

                        <div className="w-full max-w-3xl rounded-3xl border border-green-500/20 bg-[#111111] p-8">

                            <p className="text-sm uppercase tracking-[0.25em] text-green-400">

                                Qualification Management

                            </p>

                            <h2 className="mt-4 text-4xl font-black text-white">

                                Move Teams

                            </h2>

                            {
                                nextRound ? (

                                    <p className="mt-3 text-gray-400">

                                        Teams will move to
                                        {" "}
                                        <span className="font-bold text-green-400">

                                            {nextRound.name}

                                        </span>

                                    </p>

                                ) : (

                                    <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">

                                        No next round found.
                                        Create next round first.

                                    </div>

                                )
                            }

                            <div className="mt-8 space-y-3 max-h-[400px] overflow-y-auto pr-2">

                                {
                                    leaderboard.map(
                                        (
                                            item,
                                            index
                                        ) => {

                                            const checked =
                                                selectedTeams.includes(
                                                    item.team._id
                                                );

                                            return (

                                                <button
                                                    key={item.team._id}
                                                    onClick={() =>
                                                        toggleTeam(
                                                            item.team._id
                                                        )
                                                    }
                                                    className={`w-full rounded-2xl border p-5 text-left transition
                                          ${checked
                                                            ? "border-green-500/30 bg-green-500/10"
                                                            : "border-white/10 bg-white/[0.03]"
                                                        }`}
                                                >

                                                    <div className="flex items-center justify-between">

                                                        <div>

                                                            <h2 className="text-xl font-black text-white">

                                                                #{index + 1}
                                                                {" "}
                                                                {item.team.teamName}

                                                            </h2>

                                                            <p className="mt-2 text-sm text-gray-400">

                                                                {item.totalPoints}
                                                                {" "}
                                                                pts

                                                            </p>

                                                        </div>

                                                        <div
                                                            className={`h-6 w-6 rounded-md border-2
                                                ${checked
                                                                    ? "border-green-400 bg-green-400"
                                                                    : "border-white/20"
                                                                }`}
                                                        />

                                                    </div>

                                                </button>

                                            );

                                        }
                                    )
                                }

                            </div>

                            <div className="mt-8 flex items-center justify-between">

                                <p className="text-gray-400">

                                    Selected:
                                    {" "}
                                    <span className="font-bold text-white">

                                        {selectedTeams.length}

                                    </span>
                                    {" / "}
                                    {group?.round?.qualificationCount}

                                </p>

                                <div className="flex gap-4">

                                    <button
                                        onClick={() =>
                                            setShowMoveModal(
                                                false
                                            )
                                        }
                                        className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 font-bold text-gray-300"
                                    >

                                        Cancel

                                    </button>

                                    <button
                                        disabled={
                                            !nextRound ||
                                            selectedTeams.length !==
                                            group?.round?.qualificationCount
                                        }
                                        onClick={() =>
                                            setShowConfirmModal(
                                                true
                                            )
                                        }
                                        className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 font-bold text-white disabled:opacity-50"
                                    >

                                        Continue

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                )
            }

            {
                showConfirmModal && (

                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-5">

                        <div className="w-full max-w-xl rounded-3xl border border-green-500/20 bg-[#111111] p-8">

                            <p className="text-sm uppercase tracking-[0.25em] text-green-400">

                                Final Confirmation

                            </p>

                            <h2 className="mt-4 text-4xl font-black text-white">

                                Confirm Movement

                            </h2>

                            <p className="mt-5 text-gray-400 leading-relaxed">

                                Are you sure you want to move
                                {" "}
                                <span className="font-bold text-white">

                                    {selectedTeams.length}
                                    {" "}
                                    teams

                                </span>
                                {" "}
                                to
                                {" "}
                                <span className="font-bold text-green-400">

                                    {nextRound?.name}

                                </span>
                                ?

                            </p>

                            <div className="mt-10 flex gap-4">

                                <button
                                    onClick={() =>
                                        setShowConfirmModal(
                                            false
                                        )
                                    }
                                    className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 font-bold text-gray-300"
                                >

                                    Cancel

                                </button>

                                <button
                                    disabled={movingTeams}
                                    onClick={moveTeams}
                                    className="flex-1 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-4 font-bold text-white disabled:opacity-50"
                                >

                                    {
                                        movingTeams
                                            ? "Moving..."
                                            : "Confirm Move"
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
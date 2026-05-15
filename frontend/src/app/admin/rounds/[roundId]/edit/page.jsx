"use client";

import {
    use,
    useEffect,
    useState,
} from "react";

import Link from "next/link";

import {
    ArrowLeft,
    Save,
    Trophy,
    Lock,
    Loader2,
} from "lucide-react";

import API from "@/lib/axios";

import toast from "react-hot-toast";

export default function EditRoundPage({
    params,
}) {

    const { roundId } =
        use(params);

    const [loading,
        setLoading] =
        useState(true);

    const [
        showConfirmModal,
        setShowConfirmModal
    ] = useState(false);

    const [saving,
        setSaving] =
        useState(false);

    const [round,
        setRound] =
        useState(null);

    const [name,
        setName] =
        useState("");

    const [
        qualificationCount,
        setQualificationCount
    ] = useState(0);

    const [
        qualificationLocked,
        setQualificationLocked
    ] = useState(false);

    useEffect(() => {

        fetchRound();

    }, []);

    const fetchRound =
        async () => {

            try {

                const res =
                    await API.get(
                        `/rounds/${roundId}`
                    );

                const roundData =
                    res.data.data;

                setRound(
                    roundData
                );

                setName(
                    roundData.name
                );

                setQualificationCount(
                    roundData.qualificationCount
                );

                const locked =
                    roundData.groups?.some(
                        group =>
                            group.qualificationLocked
                    );

                setQualificationLocked(
                    locked
                );

            } catch (error) {

                console.log(error);

                toast.error(
                    "Failed to load round"
                );

            } finally {

                setLoading(false);

            }

        };

    const updateRound =
        async () => {

            try {

                setSaving(true);

                await API.patch(
                    `/rounds/${roundId}`,
                    {
                        name,
                        qualificationCount,
                    }
                );

                toast.success(
                    "Round updated successfully"
                );

                await fetchRound();

            } catch (error) {

                console.log(error);

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to update round"
                );

            } finally {

                setSaving(false);

            }

        };

    if (loading) {

        return (

            <div className="flex min-h-[70vh] items-center justify-center">

                <div className="flex items-center gap-4 rounded-3xl border border-cyan-500/20 bg-[#111111] px-8 py-6 text-white">

                    <Loader2
                        size={28}
                        className="animate-spin text-cyan-400"
                    />

                    <div>

                        <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">

                            Loading

                        </p>

                        <h2 className="mt-1 text-xl font-black">

                            Fetching Round

                        </h2>

                    </div>

                </div>

            </div>

        );

    }

    return (

        <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden text-white">

            {/* HEADER */}

            <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#111111] to-[#0a0a0a] px-8 py-6 shadow-[0_0_40px_rgba(34,211,238,0.12)]">

                <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

                    <div>

                        <Link
                            href={`/admin/rounds/${roundId}`}
                            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-gray-300 transition hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-white"
                        >

                            <ArrowLeft size={18} />

                            Back To Round

                        </Link>

                        <p className="mt-6 uppercase tracking-[0.3em] text-sm text-cyan-400">

                            Round Management

                        </p>

                        <h1 className="mt-3 text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 bg-clip-text text-transparent">

                            Edit Round

                        </h1>

                    </div>

                    <button
                        onClick={() =>
                            setShowConfirmModal(true)
                        }
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 font-bold text-white transition hover:scale-105 disabled:opacity-50"
                    >

                        {
                            saving

                                ? (
                                    <>

                                        <Loader2
                                            size={20}
                                            className="animate-spin"
                                        />

                                        Saving...

                                    </>
                                )

                                : (
                                    <>

                                        <Save size={20} />

                                        Save Changes

                                    </>
                                )
                        }

                    </button>

                </div>

            </div>

            {/* FORM */}

            <div className="mt-6 flex-1 overflow-y-auto">

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                    {/* ROUND NAME */}

                    <div className="rounded-3xl border border-cyan-500/20 bg-[#111111] p-8">

                        <p className="uppercase tracking-[0.25em] text-xs text-cyan-400">

                            Round Name

                        </p>

                        <h2 className="mt-3 text-3xl font-black text-white">

                            Name

                        </h2>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                            className="mt-8 h-14 w-full rounded-2xl border border-white/10 bg-black/20 px-5 text-lg font-bold text-white outline-none transition focus:border-cyan-500"
                            placeholder="Enter round name"
                        />

                    </div>

                    {/* QUALIFICATION */}

                    <div className="rounded-3xl border border-purple-500/20 bg-[#111111] p-8">

                        <div className="flex items-start justify-between gap-4">

                            <div>

                                <p className="uppercase tracking-[0.25em] text-xs text-purple-400">

                                    Qualification

                                </p>

                                <h2 className="mt-3 text-3xl font-black text-white">

                                    Qualification Count

                                </h2>

                            </div>

                            {
                                qualificationLocked && (

                                    <div className="inline-flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300">

                                        <Lock size={16} />

                                        Locked

                                    </div>

                                )
                            }

                        </div>

                        <input
                            type="number"
                            min={1}
                            disabled={
                                qualificationLocked
                            }
                            value={qualificationCount}
                            onChange={(e) =>
                                setQualificationCount(
                                    Number(
                                        e.target.value
                                    )
                                )
                            }
                            className="mt-8 h-14 w-full rounded-2xl border border-white/10 bg-black/20 px-5 text-lg font-bold text-white outline-none transition focus:border-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                        />

                        {
                            qualificationLocked && (

                                <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-5">

                                    <p className="text-sm leading-relaxed text-red-300">

                                        Qualification count cannot be changed
                                        after qualification has been completed.

                                    </p>

                                </div>

                            )
                        }

                        {
                            !qualificationLocked && (

                                <div className="mt-5 rounded-2xl border border-purple-500/20 bg-purple-500/10 p-5">

                                    <div className="flex items-start gap-3">

                                        <Trophy
                                            size={20}
                                            className="mt-0.5 text-purple-300"
                                        />

                                        <p className="text-sm leading-relaxed text-purple-200">

                                            This determines how many teams
                                            qualify from this round to the next round.

                                        </p>

                                    </div>

                                </div>

                            )
                        }

                    </div>

                </div>

            </div>

            {
                showConfirmModal && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-5">

                        <div className="w-full max-w-xl rounded-3xl border border-cyan-500/20 bg-[#111111] p-8">

                            <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">

                                Confirm Changes

                            </p>

                            <h2 className="mt-4 text-4xl font-black text-white">

                                Save Round Changes?

                            </h2>

                            <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5">

                                <div className="space-y-4">

                                    <div>

                                        <p className="text-sm text-gray-400">

                                            Round Name

                                        </p>

                                        <h3 className="mt-1 text-xl font-black text-white">

                                            {name}

                                        </h3>

                                    </div>

                                    <div>

                                        <p className="text-sm text-gray-400">

                                            Qualification Count

                                        </p>

                                        <h3 className="mt-1 text-xl font-black text-white">

                                            {qualificationCount}

                                        </h3>

                                    </div>

                                </div>

                            </div>

                            {
                                qualificationLocked && (

                                    <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-5">

                                        <p className="text-sm leading-relaxed text-red-300">

                                            Qualification count is locked.
                                            Only round name changes will be applied.

                                        </p>

                                    </div>

                                )
                            }

                            <div className="mt-10 flex gap-4">

                                <button
                                    onClick={() =>
                                        setShowConfirmModal(false)
                                    }
                                    className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 font-bold text-gray-300"
                                >

                                    Cancel

                                </button>

                                <button
                                    disabled={saving}
                                    onClick={async () => {

                                        await updateRound();

                                        setShowConfirmModal(false);

                                    }}
                                    className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-4 font-bold text-white disabled:opacity-50"
                                >

                                    {
                                        saving
                                            ? "Saving..."
                                            : "Confirm Save"
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


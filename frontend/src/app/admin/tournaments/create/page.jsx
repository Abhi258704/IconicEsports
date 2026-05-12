"use client";

import {
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import Image from "next/image";

import {
    Upload,
    Trophy,
} from "lucide-react";

import API from "@/lib/axios";

export default function CreateTournamentPage() {

    const router = useRouter();

    const [loading, setLoading] =
        useState(false);

    const [bannerPreview, setBannerPreview] =
        useState(null);

    const [formData, setFormData] =
        useState({
            name: "",
            game: "",
            prizePool: "",
            entryFee: "",
            maxTeams: "",
            teamSize: "",
            maps: [],
            rules: "",
            startDate: "",
            banner: null,
        });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value,
        });

    };

    const handleBannerChange =
        (e) => {

            const file =
                e.target.files[0];

            if (!file) return;

            setFormData({
                ...formData,
                banner: file,
            });

            setBannerPreview(
                URL.createObjectURL(file)
            );

        };

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            try {

                setLoading(true);

                const submitData =
                    new FormData();

                Object.keys(formData)
                    .forEach((key) => {

                        if (key === "maps") {

                            submitData.append(
                                "maps",
                                JSON.stringify(
                                    formData.maps
                                )
                            );

                        } else {

                            submitData.append(
                                key,
                                formData[key]
                            );

                        }

                    });

                await API.post(
                    "/tournaments",
                    submitData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data",
                        },
                    }
                );

                router.push(
                    "/admin/tournaments"
                );

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        };

    return (

        <div className="grid h-[calc(100vh-64px)] grid-cols-1 xl:grid-cols-2 gap-10 overflow-hidden">

            {/* LEFT */}

            <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#111] via-black to-[#0a0a0a] p-8 min-h-[700px]">

                <div className="absolute top-0 left-0 h-72 w-72 bg-purple-500/20 blur-3xl rounded-full" />

                <div className="absolute bottom-0 right-0 h-72 w-72 bg-cyan-500/20 blur-3xl rounded-full" />

                <div className="relative z-10 flex flex-col h-full">

                    <p className="uppercase tracking-[0.3em] text-sm text-purple-400">
                        Create Tournament
                    </p>

                    <h1 className="mt-4 text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                        New Esports Event
                    </h1>

                    <div className="mt-10 flex-1 rounded-3xl border border-white/10 bg-black/30 overflow-hidden flex items-center justify-center">

                        {bannerPreview ? (

                            <div className="relative h-full w-full">

                                <Image
                                    src={bannerPreview}
                                    alt="Banner Preview"
                                    fill
                                    className="object-cover"
                                />

                            </div>

                        ) : (

                            <div className="flex flex-col items-center text-center px-10">

                                <Trophy
                                    size={80}
                                    className="text-purple-400"
                                />

                                <p className="mt-6 text-gray-400 leading-relaxed">
                                    Upload a tournament banner
                                    to preview your esports event.
                                </p>

                            </div>

                        )}

                    </div>

                </div>

            </div>

            {/* RIGHT */}

            <form
                onSubmit={handleSubmit}
                className="h-full overflow-y-auto rounded-3xl border border-purple-500/20 bg-white/[0.03] p-8 backdrop-blur-xl"
            >

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <Input
                        label="Tournament Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <div>

                        <label className="text-sm text-gray-400">
                            Game
                        </label>

                        <select
                            name="game"
                            value={formData.game}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition focus:border-purple-500"
                        >

                            <option
                                value=""
                                className="bg-black"
                            >
                                Select Game
                            </option>

                            <option
                                value="BGMI"
                                className="bg-black"
                            >
                                BGMI
                            </option>

                        </select>

                    </div>

                    <Input
                        label="Prize Pool"
                        name="prizePool"
                        type="number"
                        value={formData.prizePool}
                        onChange={handleChange}
                    />

                    <Input
                        label="Entry Fee"
                        name="entryFee"
                        type="number"
                        value={formData.entryFee}
                        onChange={handleChange}
                    />

                    <Input
                        label="Max Teams (Total teams in tournament)"
                        name="maxTeams"
                        type="number"
                        value={formData.maxTeams}
                        onChange={handleChange}
                    />

                    <Input
                        label="Team Size (No. of players)"
                        name="teamSize"
                        type="number"
                        value={formData.teamSize}
                        onChange={handleChange}
                    />

                    <div className="md:col-span-2">

                        <label className="text-sm text-gray-400">
                            Maps
                        </label>

                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">

                            {[
                                "Erangel",
                                "Miramar",
                                "Sanhok",
                                "Vikendi",
                                "Rondo",
                                "Karakin",
                            ].map((map) => (

                                <label
                                    key={map}
                                    className={`flex cursor-pointer items-center justify-center rounded-2xl border px-4 py-4 font-semibold transition
               
               ${formData.maps.includes(map)
                                            ? "border-purple-500 bg-purple-500/20 text-purple-300"
                                            : "border-white/10 bg-black/20 text-gray-400 hover:border-purple-500/40"
                                        }`} >

                                    <input
                                        type="checkbox"
                                        hidden
                                        checked={formData.maps.includes(map)}
                                        onChange={() => {

                                            if (
                                                formData.maps.includes(map)
                                            ) {

                                                setFormData({
                                                    ...formData,

                                                    maps:
                                                        formData.maps.filter(
                                                            (item) =>
                                                                item !== map
                                                        ),
                                                });

                                            } else {

                                                setFormData({
                                                    ...formData,

                                                    maps: [
                                                        ...formData.maps,
                                                        map,
                                                    ],
                                                });

                                            }

                                        }}
                                    />

                                    {map}

                                </label>

                            ))}

                        </div>

                    </div>

                    <Input
                        label="Start Date"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                    />

                </div>

                {/* RULES */}

                <div className="mt-6">

                    <label className="text-sm text-gray-400">
                        Rules
                    </label>

                    <textarea
                        name="rules"
                        rows={5}
                        value={formData.rules}
                        onChange={handleChange}
                        placeholder="Write NOTHING - if no rules"
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition focus:border-purple-500"
                    />

                </div>

                {/* BANNER */}

                <div className="mt-6">

                    <label className="text-sm text-gray-400">
                        Tournament Banner
                    </label>

                    <label className="mt-2 flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-purple-500/30 bg-black/20 px-6 py-8 transition hover:border-purple-500">

                        <Upload size={22} />

                        <span>
                            Upload Banner
                        </span>

                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={
                                handleBannerChange
                            }
                        />

                    </label>

                </div>

                {/* BUTTON */}

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-8 w-full rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-5 text-lg font-black text-white transition hover:scale-[1.01]"
                >

                    {
                        loading
                            ? "Creating..."
                            : "Create Tournament"
                    }

                </button>

            </form>

        </div>

    );

}

/* INPUT */

function Input({
    label,
    ...props
}) {

    return (

        <div>

            <label className="text-sm text-gray-400">
                {label}
            </label>

            <input
                {...props}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition focus:border-purple-500"
            />

        </div>

    );

}
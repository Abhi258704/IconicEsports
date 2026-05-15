"use client";

import {
   use,
   useEffect,
   useState,
} from "react";

import {
   useRouter,
} from "next/navigation";

import Image from "next/image";

import toast from "react-hot-toast";

import {
   Upload,
   Trophy,
   ArrowLeft,
} from "lucide-react";

import API from "@/lib/axios";

export default function EditTournamentPage({
   params,
}) {

   const { id } = use(params);

   const router = useRouter();

   const [loading, setLoading] =
      useState(false);

   const [fetching, setFetching] =
      useState(true);

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
         teamsPerGroup: 16,
         status: "upcoming",
      });

   useEffect(() => {

      fetchTournament();

   }, []);

   const fetchTournament =
      async () => {

         try {

            const res =
               await API.get(
                  `/tournaments/${id}`
               );

            const responseData =
               res.data.data;

            const tournament =
               responseData.tournament;

            setBannerPreview(
               tournament.banner
            );

            setFormData({

               name:
                  tournament.name || "",

               game:
                  tournament.game || "",

               prizePool:
                  tournament.prizePool || "",

               entryFee:
                  tournament.entryFee || "",

               maxTeams:
                  tournament.maxTeams || "",

               teamSize:
                  tournament.teamSize || "",

               teamsPerGroup:
                  tournament.teamsPerGroup || 16,

               maps:
                  tournament.maps || [],

               rules:
                  tournament.rules || "",

               startDate:
                  tournament.startDate
                     ?.split("T")[0] || "",

               status:
                  tournament.status ||
                  "upcoming",

               banner: null,

            });

         } catch (error) {

            console.log(error);

            toast.error(
               "Failed to load tournament"
            );

         } finally {

            setFetching(false);

         }

      };

   const handleChange =
      (e) => {

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

         const confirmed =
            window.confirm(
               "Are you sure you want to update this tournament?"
            );

         if (!confirmed) return;

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

                  } else if (
                     formData[key] !== null
                  ) {

                     submitData.append(
                        key,
                        formData[key]
                     );

                  }

               });

            await API.patch(
               `/tournaments/${id}`,
               submitData,
               {
                  headers: {
                     "Content-Type":
                        "multipart/form-data",
                  },
               }
            );

            toast.success(
               "Tournament updated successfully"
            );

            router.push(
               `/admin/tournaments/${id}`
            );

         } catch (error) {

            console.log(error);

            toast.error(
               error?.response?.data?.message ||
               "Update failed"
            );

         } finally {

            setLoading(false);

         }

      };

   if (fetching) {

      return (

         <div className="flex min-h-[70vh] items-center justify-center">

            <div className="h-20 w-20 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />

         </div>

      );

   }

   return (

      <div className="grid h-[calc(100vh-64px)] grid-cols-1 gap-8 overflow-hidden xl:grid-cols-2">

         {/* LEFT */}

         <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#111] via-black to-[#0a0a0a] p-8">

            <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col">

               <button
                  type="button"
                  onClick={() =>
                     router.back()
                  }
                  className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-gray-300 transition hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-white"
               >

                  <ArrowLeft size={18} />

                  Back

               </button>

               <p className="mt-8 text-sm uppercase tracking-[0.3em] text-purple-400">

                  Edit Tournament

               </p>

               <h1 className="mt-4 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-5xl font-black text-transparent">

                  Update Esports Event

               </h1>

               <div className="mt-10 flex-1 overflow-hidden rounded-3xl border border-white/10 bg-black/30">

                  {
                     bannerPreview ? (

                        <div className="relative h-full min-h-[600px] w-full">

                           <Image
                              src={bannerPreview}
                              alt="Banner Preview"
                              fill
                              className="object-cover"
                           />

                           <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

                           <div className="absolute bottom-0 left-0 right-0 p-8">

                              <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">

                                 Tournament Preview

                              </p>

                              <h2 className="mt-3 text-5xl font-black text-white">

                                 {
                                    formData.name ||
                                    "Tournament Name"
                                 }

                              </h2>

                              <div className="mt-5 flex flex-wrap gap-3">

                                 <div className="rounded-2xl bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-xl">

                                    Prize Pool:
                                    {" "}
                                    ₹
                                    {
                                       formData.prizePool || 0
                                    }

                                 </div>

                                 <div className="rounded-2xl bg-purple-500/20 px-5 py-3 text-sm font-bold text-purple-300 backdrop-blur-xl">

                                    {
                                       formData.game || "BGMI"
                                    }

                                 </div>

                                 <div className="rounded-2xl bg-cyan-500/20 px-5 py-3 text-sm font-bold capitalize text-cyan-300 backdrop-blur-xl">

                                    {
                                       formData.status
                                    }

                                 </div>

                              </div>

                           </div>

                        </div>

                     ) : (

                        <div className="flex h-full min-h-[600px] flex-col items-center justify-center px-10 text-center">

                           <Trophy
                              size={80}
                              className="text-purple-400"
                           />

                           <p className="mt-6 leading-relaxed text-gray-400">

                              Upload a tournament banner
                              to preview your esports event.

                           </p>

                        </div>

                     )
                  }

               </div>

            </div>

         </div>

         {/* RIGHT */}

         <form
            onSubmit={handleSubmit}
            className="h-full overflow-y-auto rounded-3xl border border-purple-500/20 bg-white/[0.03] p-8 backdrop-blur-xl"
         >

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

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
                  label="Max Teams"
                  name="maxTeams"
                  type="number"
                  value={formData.maxTeams}
                  onChange={handleChange}
               />

               <Input
                  label="Team Size"
                  name="teamSize"
                  type="number"
                  value={formData.teamSize}
                  onChange={handleChange}
               />

               <Input
                  label="Teams Per Group"
                  name="teamsPerGroup"
                  type="number"
                  value={formData.teamsPerGroup}
                  onChange={handleChange}
               />

               <Input
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
               />

               <div className="md:col-span-2">

                  <label className="text-sm text-gray-400">

                     Status

                  </label>

                  <select
                     name="status"
                     value={formData.status}
                     onChange={handleChange}
                     className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition focus:border-purple-500"
                  >

                     <option value="upcoming">
                        Upcoming
                     </option>

                     <option value="ongoing">
                        Ongoing
                     </option>

                     <option value="completed">
                        Completed
                     </option>

                     <option value="cancelled">
                        Cancelled
                     </option>

                  </select>

               </div>

               <div className="md:col-span-2">

                  <label className="text-sm text-gray-400">

                     Tournament Banner

                  </label>

                  <label className="mt-2 flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-purple-500/30 bg-black/30 px-6 py-8 text-gray-300 transition hover:border-purple-500 hover:bg-purple-500/10">

                     <Upload size={22} />

                     <span className="font-medium">

                        Upload New Banner

                     </span>

                     <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerChange}
                        className="hidden"
                     />

                  </label>

               </div>

            </div>

            <div className="mt-10 flex items-center justify-end gap-4 border-t border-white/10 pt-6">

               <button
                  type="button"
                  onClick={() => router.back()}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
               >
                  Cancel
               </button>

               <button
                  type="submit"
                  disabled={loading}
                  className="rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 font-bold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
               >
                  {
                     loading
                        ? "Saving..."
                        : "Save Tournament"
                  }
               </button>

            </div>

         </form>

      </div>

   );

}

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
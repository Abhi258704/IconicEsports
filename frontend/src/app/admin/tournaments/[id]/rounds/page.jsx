"use client";

import {
   use,
   useEffect,
   useState,
} from "react";

import Link from "next/link";

import toast from "react-hot-toast";

import {
   ArrowLeft,
   Plus,
   Trophy,
   Layers3,
   CheckCircle2,
} from "lucide-react";

import API from "@/lib/axios";

export default function TournamentRoundsPage({
   params,
}) {

   const { id } = use(params);

   const [rounds, setRounds] =
      useState([]);

   const [loading, setLoading] =
      useState(true);

   const [createModal, setCreateModal] =
      useState(false);

   const [creating, setCreating] =
      useState(false);

   const [formData, setFormData] =
      useState({
         name: "",
         roundNumber: "",
         qualificationCount: 4,
      });

   useEffect(() => {

      fetchRounds();

   }, []);

   const fetchRounds =
      async () => {

         try {

            const res =
               await API.get(
                  `/rounds/tournament/${id}`
               );

            setRounds(
               res.data.data
            );

         } catch (error) {

            console.log(error);

         } finally {

            setLoading(false);

         }

      };

   const handleChange = (e) => {

      setFormData({
         ...formData,
         [e.target.name]:
            e.target.value,
      });

   };

   const createRound =
      async (e) => {

         e.preventDefault();

         try {

            setCreating(true);

            await API.post(
               "/rounds",
               {
                  tournamentId: id,

                  name:
                     formData.name,

                  roundNumber:
                     formData.roundNumber,

                  qualificationCount:
                     formData.qualificationCount,
               }
            );

            toast.success(
               "Round created successfully"
            );

            setCreateModal(false);

            setFormData({
               name: "",
               roundNumber: "",
               qualificationCount: 4,
            });

            fetchRounds();

         } catch (error) {

            console.log(error);

            toast.error(
               error?.response?.data?.message ||
               "Failed to create round"
            );

         } finally {

            setCreating(false);

         }

      };

   const qualifyRound =
      async (roundId) => {

         try {

            await API.post(
               `/rounds/${roundId}/qualify`
            );

            toast.success(
               "Teams qualified successfully"
            );

            fetchRounds();

         } catch (error) {

            console.log(error);

            toast.error(
               error?.response?.data?.message ||
               "Qualification failed"
            );

         }

      };

   if (loading) {

      return (

         <div className="min-h-[70vh] flex items-center justify-center">

            <div className="h-20 w-20 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />

         </div>

      );

   }

   return (

      <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden">

         {/* HEADER */}

         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

               <Link
                  href={`/admin/tournaments/${id}`}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-gray-300 transition hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-white"
               >

                  <ArrowLeft size={18} />

                  Back

               </Link>

               <p className="mt-6 uppercase tracking-[0.3em] text-sm text-purple-400">
                  Tournament Flow
               </p>

               <h1 className="mt-3 text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                  Tournament Rounds
               </h1>

            </div>

            <button
               onClick={() =>
                  setCreateModal(true)
               }
               className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-4 font-bold text-white transition hover:scale-105"
            >

               <Plus size={20} />

               Create Round

            </button>

         </div>

         {/* SCROLL */}

         <div className="mt-10 flex-1 overflow-y-auto pr-2">

            {
               rounds.length === 0 ? (

                  <div className="rounded-3xl border border-purple-500/20 bg-white/[0.03] p-16 text-center">

                     <Layers3
                        size={70}
                        className="mx-auto text-purple-400"
                     />

                     <h2 className="mt-6 text-3xl font-black text-white">
                        No Rounds Yet
                     </h2>

                     <p className="mt-3 text-gray-400">
                        Create your first tournament round.
                     </p>

                  </div>

               ) : (

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                     {
                        rounds.map(
                           (round) => (

                              <div
                                 key={round._id}
                                 className="rounded-3xl border border-purple-500/20 bg-white/[0.03] p-8 backdrop-blur-xl"
                              >

                                 <div className="flex items-start justify-between gap-4">

                                    <div>

                                       <p className="uppercase tracking-[0.25em] text-xs text-purple-400">
                                          Round {round.roundNumber}
                                       </p>

                                       <h2 className="mt-3 text-4xl font-black text-white">
                                          {round.name}
                                       </h2>

                                    </div>

                                    <div
                                       className={`rounded-2xl px-4 py-2 text-sm font-bold

                                       ${
                                          round.status ===
                                          "completed"

                                             ? "bg-green-500/20 text-green-400"

                                             : round.status ===
                                               "ongoing"

                                             ? "bg-cyan-500/20 text-cyan-400"

                                             : "bg-yellow-500/20 text-yellow-400"
                                       }`}
                                    >

                                       {round.status}

                                    </div>

                                 </div>

                                 {/* STATS */}

                                 <div className="mt-8 grid grid-cols-2 gap-5">

                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

                                       <p className="text-sm text-gray-400">
                                          Qualification Count
                                       </p>

                                       <h2 className="mt-3 text-3xl font-black text-white">
                                          {round.qualificationCount}
                                       </h2>

                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

                                       <p className="text-sm text-gray-400">
                                          Groups
                                       </p>

                                       <h2 className="mt-3 text-3xl font-black text-white">
                                          {round.groups.length}
                                       </h2>

                                    </div>

                                 </div>

                                 {/* ACTIONS */}

                                 <div className="mt-8 flex flex-wrap gap-4">

                                    <Link
                                       href={`/admin/rounds/${round._id}`}
                                       className="rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-4 font-bold text-white transition hover:scale-105"
                                    >
                                       Manage Round
                                    </Link>

                                    {/* {
                                       round.status !==
                                       "completed" && (

                                          <button
                                             onClick={() =>
                                                qualifyRound(
                                                   round._id
                                                )
                                             }
                                             className="flex items-center gap-2 rounded-2xl border border-green-500/20 bg-green-500/10 px-6 py-4 font-bold text-green-400 transition hover:bg-green-500/20"
                                          >

                                             <CheckCircle2 size={18} />

                                             Qualify Teams

                                          </button>

                                       )
                                    } */}

                                 </div>

                              </div>

                           )
                        )
                     }

                  </div>

               )
            }

         </div>

         {/* CREATE MODAL */}

         {
            createModal && (

               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

                  <div className="w-full max-w-xl rounded-3xl border border-purple-500/20 bg-[#0f0f0f] p-8">

                     <h2 className="text-4xl font-black text-white">
                        Create Round
                     </h2>

                     <form
                        onSubmit={createRound}
                        className="mt-8 space-y-6"
                     >

                        <Input
                           label="Round Name"
                           name="name"
                           value={formData.name}
                           onChange={handleChange}
                        />

                        <Input
                           label="Round Number"
                           name="roundNumber"
                           type="number"
                           value={formData.roundNumber}
                           onChange={handleChange}
                        />

                        <Input
                           label="Qualification Count"
                           name="qualificationCount"
                           type="number"
                           value={formData.qualificationCount}
                           onChange={handleChange}
                        />

                        <div className="flex gap-4 pt-4">

                           <button
                              type="button"
                              onClick={() =>
                                 setCreateModal(false)
                              }
                              className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-semibold text-white transition hover:bg-white/10"
                           >
                              Cancel
                           </button>

                           <button
                              type="submit"
                              disabled={creating}
                              className="flex-1 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 px-5 py-4 font-bold text-white"
                           >

                              {
                                 creating
                                    ? "Creating..."
                                    : "Create Round"
                              }

                           </button>

                        </div>

                     </form>

                  </div>

               </div>

            )
         }

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
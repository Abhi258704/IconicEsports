"use client";

import {
   useEffect,
   useMemo,
   useState,
} from "react";

import axios from "@/lib/axios";

import Link from "next/link";

import {
   useParams,
   useRouter,
} from "next/navigation";

import toast from "react-hot-toast";

import {
   Trophy,
   ArrowLeft,
   CheckCircle2,
   Loader2,
   AlertTriangle,
} from "lucide-react";

export default function MatchResultsPage() {

   const { matchId } =
      useParams();

   const router =
      useRouter();

   const [match,
      setMatch] =
      useState(null);

   const [results,
      setResults] =
      useState([]);

   const [loading,
      setLoading] =
      useState(true);

   const [saving,
      setSaving] =
      useState(false);

   const [hasChanges,
      setHasChanges] =
      useState(false);

   const [
      showLeaveModal,
      setShowLeaveModal
   ] = useState(false);

   const fetchMatch =
      async () => {

         try {

            const { data } =
               await axios.get(
                  `/matches/${matchId}`
               );

            setMatch(
               data.data
            );

            const sortedResults =
               [...data.data.teams]
                  .map((team) => {

                     const existing =
                        data.data.results?.find(
                           (r) =>
                              r.team._id ===
                              team._id
                        );

                     return {

                        team:
                           team._id,

                        teamName:
                           team.teamName,

                        placementPoints:
                           existing?.placementPoints || 0,

                        kills:
                           existing?.kills || 0,

                        totalPoints:
                           existing?.totalPoints || 0,

                     };

                  })

                  .sort((a, b) => {

                     if (
                        b.totalPoints ===
                        a.totalPoints
                     ) {

                        return (
                           b.placementPoints -
                           a.placementPoints
                        );

                     }

                     return (
                        b.totalPoints -
                        a.totalPoints
                     );

                  });

            setResults(
               sortedResults
            );

         } catch (error) {

            console.log(error);

            toast.error(
               "Failed to fetch match"
            );

         } finally {

            setLoading(false);

         }

      };

   useEffect(() => {

      fetchMatch();

   }, []);

   useEffect(() => {

      const handleBeforeUnload =
         (e) => {

            if (!hasChanges) {

               return;

            }

            e.preventDefault();

            e.returnValue = "";

         };

      window.addEventListener(
         "beforeunload",
         handleBeforeUnload
      );

      return () => {

         window.removeEventListener(
            "beforeunload",
            handleBeforeUnload
         );

      };

   }, [hasChanges]);

   const updateResult =
      (
         teamId,
         field,
         value
      ) => {

         setHasChanges(true);

         setResults((prev) =>

            prev.map((team) => {

               if (
                  team.team !==
                  teamId
               ) {

                  return team;

               }

               const updated =
               {

                  ...team,

                  [field]:
                     Math.max(
                        0,
                        Number(value)
                     ),

               };

               updated.totalPoints =
                  updated.kills +
                  updated.placementPoints;

               return updated;

            })

         );

      };

   const saveResults =
      async () => {

         try {

            setSaving(true);

            await axios.patch(
               `/matches/${matchId}/result`,
               {
                  results,
               }
            );

            toast.success(
               "Results saved successfully"
            );

            setHasChanges(false);

            await fetchMatch();

         } catch (error) {

            console.log(error);

            toast.error(
               error?.response?.data?.message ||
               "Failed to save results"
            );

         } finally {

            setSaving(false);

         }

      };

   if (loading) {

      return (
         <div className="flex h-screen items-center justify-center bg-[#050505] text-white">

            Loading...

         </div>
      );

   }

   return (

      <>

         <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden bg-[#050505] p-4 text-white">

            {/* TOP */}

            <div>

               <button
                  onClick={() => {

                     if (
                        hasChanges
                     ) {

                        setShowLeaveModal(
                           true
                        );

                        return;

                     }

                     router.back();

                  }}
                  className="mb-4 inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-bold text-white transition hover:bg-white/[0.06]"
               >

                  <ArrowLeft size={18} />

                  Back

               </button>

               <div className="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-[#111111] to-[#0a0a0a] px-8 py-6 shadow-[0_0_50px_rgba(249,115,22,0.12)]">

                  <div className="flex flex-wrap items-center justify-between gap-5">

                     <div>

                        <p className="uppercase tracking-[0.25em] text-xs text-orange-400">

                           Match Results

                        </p>

                        <h1 className="mt-3 text-4xl font-black text-white">

                           {match.name}

                        </h1>

                        <div className="mt-4 flex flex-wrap gap-3">

                           <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-bold text-gray-300">

                              {match.map}

                           </div>

                           <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-bold text-gray-300">

                              {
                                 new Date(
                                    match.scheduledAt
                                 ).toLocaleString(
                                    "en-GB",
                                    {

                                       day: "2-digit",

                                       month: "short",

                                       hour: "2-digit",

                                       minute: "2-digit",

                                       hour12: false,

                                    }
                                 )
                              }

                           </div>

                        </div>

                     </div>

                     {
                        match.status ===
                           "completed"

                           ? (

                              <div className="rounded-2xl bg-green-500/20 px-5 py-3 text-sm font-bold text-green-300">

                                 Completed

                              </div>

                           )

                           : (

                              <div className="rounded-2xl bg-orange-500/20 px-5 py-3 text-sm font-bold text-orange-300">

                                 Ongoing

                              </div>

                           )
                     }

                  </div>

               </div>

            </div>

            {/* TABLE */}

            <div className="mt-6 flex-1 overflow-y-auto rounded-3xl border border-white/10 bg-[#111111]">

               <table className="w-full">

                  <thead className="sticky top-0 z-10 border-b border-white/10 bg-[#0d0d0d] backdrop-blur-xl">

                     <tr>

                        <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-[0.2em] text-orange-400">

                           #

                        </th>

                        <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-[0.2em] text-orange-400">

                           Team

                        </th>

                        <th className="px-6 py-5 text-center text-sm font-bold uppercase tracking-[0.2em] text-orange-400">

                           PP

                        </th>

                        <th className="px-6 py-5 text-center text-sm font-bold uppercase tracking-[0.2em] text-orange-400">

                           Kills

                        </th>

                        <th className="px-6 py-5 text-center text-sm font-bold uppercase tracking-[0.2em] text-orange-400">

                           Total

                        </th>

                     </tr>

                  </thead>

                  <tbody>

                     {
                        results.map(
                           (
                              team,
                              index
                           ) => (

                              <tr
                                 key={
                                    team.team
                                 }
                                 className="border-b border-white/5 transition hover:bg-white/[0.02]"
                              >

                                 <td className="px-6 py-5">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500/10 font-black text-orange-300">

                                       {index + 1}

                                    </div>

                                 </td>

                                 <td className="px-6 py-5">

                                    <Link
                                       href={`/admin/teams/${team.team}`}
                                       target="_blank"
                                       className="font-bold text-white transition hover:text-orange-400"
                                    >

                                       {team.teamName}

                                    </Link>

                                 </td>

                                 <td className="px-6 py-5 text-center">

                                    <input
                                       type="number"
                                       min={0}
                                       value={
                                          team.placementPoints
                                       }
                                       onWheel={(e) =>
                                          e.target.blur()
                                       }
                                       onChange={(e) =>
                                          updateResult(
                                             team.team,
                                             "placementPoints",
                                             e.target.value
                                          )
                                       }
                                       className="h-12 w-28 rounded-2xl border border-white/10 bg-black/30 px-4 text-center font-bold text-white outline-none transition focus:border-orange-500"
                                    />

                                 </td>

                                 <td className="px-6 py-5 text-center">

                                    <input
                                       type="number"
                                       min={0}
                                       value={
                                          team.kills
                                       }
                                       onWheel={(e) =>
                                          e.target.blur()
                                       }
                                       onChange={(e) =>
                                          updateResult(
                                             team.team,
                                             "kills",
                                             e.target.value
                                          )
                                       }
                                       className="h-12 w-28 rounded-2xl border border-white/10 bg-black/30 px-4 text-center font-bold text-white outline-none transition focus:border-red-500"
                                    />

                                 </td>

                                 <td className="px-6 py-5 text-center">

                                    <div className="inline-flex min-w-[110px] items-center justify-center gap-2 rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-3 font-black text-green-300">

                                       <Trophy size={18} />

                                       {
                                          team.totalPoints
                                       }

                                    </div>

                                 </td>

                              </tr>

                           )
                        )
                     }

                  </tbody>

               </table>

            </div>

            {/* FOOTER */}

            <div className="mt-5 rounded-3xl border border-orange-500/20 bg-[#0a0a0a]/95 p-5 backdrop-blur-xl shadow-[0_0_35px_rgba(249,115,22,0.12)]">

               <div className="flex flex-wrap items-center justify-between gap-5">

                  <div>

                     <p className="text-sm uppercase tracking-[0.25em] text-orange-400">

                        Match Submission

                     </p>

                     <h2 className="mt-2 text-2xl font-black text-white">

                        Save Match Results

                     </h2>

                     {
                        hasChanges && (

                           <p className="mt-2 text-sm text-yellow-400">

                              Unsaved changes

                           </p>

                        )
                     }

                  </div>

                  <button
                     onClick={
                        saveResults
                     }
                     disabled={saving}
                     className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 font-black text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
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

                                 <CheckCircle2
                                    size={20}
                                 />

                                 Save Results

                              </>
                           )
                     }

                  </button>

               </div>

            </div>

         </div>

         {/* LEAVE MODAL */}

         {
            showLeaveModal && (

               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-5">

                  <div className="w-full max-w-md rounded-3xl border border-yellow-500/20 bg-[#111111] p-8">

                     <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-400">

                           <AlertTriangle size={28} />

                        </div>

                        <div>

                           <p className="text-sm uppercase tracking-[0.25em] text-yellow-400">

                              Unsaved Changes

                           </p>

                           <h2 className="mt-2 text-2xl font-black text-white">

                              Leave Page?

                           </h2>

                        </div>

                     </div>

                     <p className="mt-6 leading-relaxed text-gray-400">

                        You have unsaved match results.
                        Leaving now will discard your changes.

                     </p>

                     <div className="mt-8 flex gap-4">

                        <button
                           onClick={() =>
                              setShowLeaveModal(
                                 false
                              )
                           }
                           className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 font-bold text-gray-300"
                        >

                           Stay

                        </button>

                        <button
                           onClick={() =>
                              router.back()
                           }
                           className="flex-1 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 px-5 py-4 font-bold text-white"
                        >

                           Leave

                        </button>

                     </div>

                  </div>

               </div>

            )
         }

      </>

   );

}
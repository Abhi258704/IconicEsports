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
   CheckCircle2,
   XCircle,
   Users,
   Search,
} from "lucide-react";

import API from "@/lib/axios";

export default function PendingTeamsPage({
   params,
}) {

   const { id } = use(params);

   const [teams, setTeams] =
      useState([]);

   const [
      manualPlacementModal,
      setManualPlacementModal
   ] = useState(false);

   const [
      availableRounds,
      setAvailableRounds
   ] = useState([]);

   const [
      selectedRound,
      setSelectedRound
   ] = useState("");

   const [
      selectedGroup,
      setSelectedGroup
   ] = useState("");

   const [
      availableGroups,
      setAvailableGroups
   ] = useState([]);

   const [
      placementTeam,
      setPlacementTeam
   ] = useState(null);

   const [filteredTeams,
      setFilteredTeams] =
      useState([]);

   const [search, setSearch] =
      useState("");

   const [loading, setLoading] =
      useState(true);

   const [confirmModal,
      setConfirmModal] =
      useState(false);

   const [selectedTeam,
      setSelectedTeam] =
      useState(null);

   const [actionType,
      setActionType] =
      useState("");

   useEffect(() => {

      fetchPendingTeams();

   }, []);

   useEffect(() => {

      const filtered =
         teams.filter((team) =>
            team.teamName
               .toLowerCase()
               .includes(
                  search.toLowerCase()
               )
         );

      setFilteredTeams(
         filtered
      );

   }, [search, teams]);

   const fetchPendingTeams =
      async () => {

         try {

            const res =
               await API.get(
                  `/teams/tournament/${id}`
               );

            const pending =
               res.data.data.filter(
                  (team) =>
                     team.status ===
                     "pending"
               );

            setTeams(
               pending
            );

            setFilteredTeams(
               pending
            );

         } catch (error) {

            console.log(error);

         } finally {

            setLoading(false);

         }

      };

   const fetchGroups =
      async (roundId) => {

         try {

            const res =
               await API.get(
                  `/teams/round/${roundId}/groups`
               );

            setAvailableGroups(
               res.data.data
            );

         } catch (error) {

            console.log(error);

            toast.error(
               "Failed to fetch groups"
            );

         }

      };

   const manualAssignTeam =
      async () => {

         try {

            await API.post(

               `/teams/${placementTeam._id}/manual-assign`,

               {
                  roundId:
                     selectedRound,

                  groupId:
                     selectedGroup,
               }

            );

            toast.success(
               "Team assigned successfully"
            );

            setManualPlacementModal(
               false
            );

            setSelectedRound("");

            setSelectedGroup("");

            setPlacementTeam(
               null
            );

            fetchPendingTeams?.();

         } catch (error) {

            console.log(error);

            toast.error(

               error?.response?.data?.message ||

               "Assignment failed"

            );

         }

      };

   const verifyTeam =
      async (teamId) => {

         try {

            const res =
               await API.patch(
                  `/teams/${teamId}/verify`
               );

            const data =
               res.data.data;

            if (
               data.requiresManualPlacement
            ) {

               setPlacementTeam(
                  data.team
               );

               setAvailableRounds(
                  data.rounds
               );

               setManualPlacementModal(
                  true
               );

               return;

            }

            toast.success(
               `${selectedTeam.teamName} verified successfully`
            );

            setTeams((prev) =>
               prev.filter(
                  (team) =>
                     team._id !== teamId
               )
            );

         } catch (error) {

            console.log(error);

            toast.error(
               "Verification failed"
            );

         }

      };

   const rejectTeam =
      async (teamId) => {

         try {

            await API.patch(
               `/teams/${teamId}/reject`
            );

            toast.success(
               `${selectedTeam.teamName} rejected`
            );

            setTeams((prev) =>
               prev.filter(
                  (team) =>
                     team._id !== teamId
               )
            );

         } catch (error) {

            console.log(error);

            toast.error(
               "Rejection failed"
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

               <p className="mt-6 uppercase tracking-[0.3em] text-sm text-yellow-400">
                  Tournament Registrations
               </p>

               <h1 className="mt-3 text-5xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-400 bg-clip-text text-transparent">
                  Pending Teams
               </h1>

            </div>

         </div>

         {/* SEARCH */}

         <div className="mt-10 relative">

            <Search
               size={20}
               className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
               type="text"
               placeholder="Search pending teams..."
               value={search}
               onChange={(e) =>
                  setSearch(
                     e.target.value
                  )
               }
               className="w-full rounded-3xl border border-white/10 bg-white/[0.03] py-5 pl-14 pr-5 text-white outline-none transition focus:border-yellow-500"
            />

         </div>

         {/* SCROLL */}

         <div className="mt-10 flex-1 overflow-y-auto pr-2">

            {
               filteredTeams.length === 0 ? (

                  <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-16 text-center">

                     <Users
                        size={70}
                        className="mx-auto text-yellow-400"
                     />

                     <h2 className="mt-6 text-3xl font-black text-white">
                        No Pending Teams
                     </h2>

                     <p className="mt-3 text-gray-400">
                        All registrations processed.
                     </p>

                  </div>

               ) : (

                  <div className="space-y-6">

                     {
                        filteredTeams.map(
                           (team) => (

                              <div
                                 key={team._id}
                                 className="rounded-3xl border border-yellow-500/20 bg-white/[0.03] p-8"
                              >

                                 <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

                                    <div>

                                       <p className="uppercase tracking-[0.25em] text-xs text-yellow-400">
                                          Pending Verification
                                       </p>

                                       <h2 className="mt-3 text-4xl font-black text-white">
                                          {team.teamName}
                                       </h2>

                                       <div className="mt-5 space-y-2 text-gray-400">

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

                                    <div className="flex-1">

                                       <p className="uppercase tracking-[0.25em] text-xs text-purple-400">
                                          Players
                                       </p>

                                       <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">

                                          {
                                             team.players.map(
                                                (
                                                   player,
                                                   index
                                                ) => (

                                                   <div
                                                      key={index}
                                                      className="rounded-2xl border border-white/10 bg-black/20 p-5"
                                                   >

                                                      <h3 className="text-lg font-bold text-white">
                                                         {player.ign}
                                                      </h3>

                                                      <p className="mt-2 text-sm text-gray-400">
                                                         UID:
                                                         {" "}
                                                         {player.uid}
                                                      </p>

                                                   </div>

                                                )
                                             )
                                          }

                                       </div>

                                    </div>

                                    <div className="flex flex-col gap-4">

                                       <button
                                          onClick={() => {

                                             setSelectedTeam(team);

                                             setActionType(
                                                "verify"
                                             );

                                             setConfirmModal(
                                                true
                                             );

                                          }}
                                          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 font-bold text-white transition hover:scale-105"
                                       >

                                          <CheckCircle2 size={20} />

                                          Verify

                                       </button>

                                       {/* <button
                                          onClick={() => {

                                             setSelectedTeam(team);

                                             setActionType(
                                                "reject"
                                             );

                                             setConfirmModal(
                                                true
                                             );

                                          }}
                                          className="flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-4 font-bold text-red-400 transition hover:bg-red-500/20"
                                       >

                                          <XCircle size={20} />

                                          Reject

                                       </button> */}

                                    </div>

                                 </div>

                              </div>

                           )
                        )
                     }

                  </div>

               )
            }

         </div>

         {
            confirmModal && (

               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-5">

                  <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111111] p-8">

                     <p className="uppercase tracking-[0.25em] text-xs text-purple-400">
                        Confirm Action
                     </p>

                     <h2 className="mt-4 text-3xl font-black text-white">

                        {
                           actionType ===
                              "verify"

                              ? "Verify Team?"

                              : "Reject Team?"
                        }

                     </h2>

                     <p className="mt-5 text-gray-400">

                        Are you sure you want to
                        {" "}

                        {
                           actionType
                        }

                        {" "}
                        <span className="font-bold text-white">
                           {
                              selectedTeam?.teamName
                           }
                        </span>

                        ?

                     </p>

                     <div className="mt-10 flex gap-4">

                        <button
                           onClick={() =>
                              setConfirmModal(
                                 false
                              )
                           }
                           className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 font-bold text-gray-300 transition hover:bg-white/[0.06]"
                        >

                           Cancel

                        </button>

                        <button
                           onClick={async () => {

                              if (
                                 actionType ===
                                 "verify"
                              ) {

                                 await verifyTeam(
                                    selectedTeam._id
                                 );

                              } else {

                                 await rejectTeam(
                                    selectedTeam._id
                                 );

                              }

                              setConfirmModal(
                                 false
                              );

                           }}
                           className={`flex-1 rounded-2xl px-5 py-4 font-bold text-white transition hover:scale-105

                  ${actionType ===
                                 "verify"

                                 ? "bg-gradient-to-r from-green-500 to-emerald-500"

                                 : "bg-gradient-to-r from-red-500 to-pink-500"
                              }`}
                        >

                           Confirm

                        </button>

                     </div>

                  </div>

               </div>

            )
         }

         {
            manualPlacementModal && (

               <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-5">

                  <div className="w-full max-w-lg rounded-3xl border border-cyan-500/20 bg-[#111111] p-8">

                     <p className="uppercase tracking-[0.25em] text-xs text-cyan-400">

                        Manual Placement

                     </p>

                     <h2 className="mt-4 text-3xl font-black text-white">

                        Tournament Already Started

                     </h2>

                     <p className="mt-4 leading-relaxed text-gray-400">

                        Select which round this team
                        should join.

                     </p>

                     {
                        placementTeam && (

                           <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                              <p className="text-sm text-gray-400">

                                 Team

                              </p>

                              <h3 className="mt-2 text-2xl font-black text-white">

                                 {
                                    placementTeam.teamName
                                 }

                              </h3>

                           </div>

                        )
                     }

                     <div className="mt-8">

                        <label className="text-sm text-gray-400">

                           Select Round

                        </label>

                        <select
                           value={selectedRound}
                           onChange={async (e) => {

                              const value =
                                 e.target.value;

                              setSelectedRound(
                                 value
                              );

                              setSelectedGroup("");

                              if (value) {

                                 await fetchGroups(
                                    value
                                 );

                              }

                           }}
                           className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none"
                        >

                           <option value="">
                              Choose Round
                           </option>

                           {
                              availableRounds.map(
                                 (round) => (

                                    <option
                                       key={round._id}
                                       value={round._id}
                                    >

                                       Round {round.roundNumber}
                                       {" - "}
                                       {round.name}

                                    </option>

                                 )
                              )
                           }

                        </select>

                     </div>

                     <div className="mt-6">

                        <label className="text-sm text-gray-400">

                           Select Group

                        </label>

                        <select
                           value={selectedGroup}
                           onChange={(e) =>
                              setSelectedGroup(
                                 e.target.value
                              )
                           }
                           className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none"
                        >

                           <option value="">
                              Choose Group
                           </option>

                           {
                              availableGroups.map(
                                 (group) => (

                                    <option
                                       key={group._id}
                                       value={group._id}
                                    >

                                       {group.name}
                                       {" • "}
                                       {
                                          group.teams?.length || 0
                                       }
                                       {" teams"}

                                    </option>

                                 )
                              )
                           }

                        </select>

                     </div>

                     <div className="mt-10 flex justify-end gap-4">

                        <button
                           onClick={() => {

                              setManualPlacementModal(
                                 false
                              );

                              setSelectedRound("");

                              setSelectedGroup("");

                              setPlacementTeam(
                                 null
                              );

                              setAvailableGroups([]);

                           }}
                           className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 font-bold text-gray-300"
                        >

                           Cancel

                        </button>

                        <button
                           disabled={
                              !selectedRound ||
                              !selectedGroup
                           }
                           onClick={manualAssignTeam}
                           className="rounded-2xl bg-cyan-500 px-6 py-4 font-bold text-black transition hover:bg-cyan-400 disabled:opacity-50"
                        >

                           Continue

                        </button>

                     </div>

                  </div>

               </div>

            )
         }

      </div>

   );

}
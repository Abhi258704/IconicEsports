"use client";

import {
   useEffect,
   useState,
} from "react";

import {
   useParams,
} from "next/navigation";

import Link
   from "next/link";

import axios
   from "@/lib/axios";

import toast
   from "react-hot-toast";

import {
   ArrowLeft,
   Swords,
   Trophy,
   Plus,
   CalendarDays,
   Clock3,
   Calendar,
   Clock4,
} from "lucide-react";

export default function GroupMatchesPage() {

   const { id } =
      useParams();

   const [showEditModal,
      setShowEditModal] =
      useState(false);

   const [editData,
      setEditData] =
      useState({

         matchNumber: "",

         map: "Erangel",

         date: "",

         time: "",

      });

   const [selectedMatch,
      setSelectedMatch] =
      useState(null);

   const [showRoomModal,
      setShowRoomModal] =
      useState(false);

   const [roomData,
      setRoomData] =
      useState({

         roomId: "",

         roomPassword: "",

         startTime: "",

      });

   const [group, setGroup] =
      useState(null);

   const [matches, setMatches] =
      useState([]);

   const [loading, setLoading] =
      useState(true);

   const [showCreateModal,
      setShowCreateModal] =
      useState(false);

   const [creating, setCreating] =
      useState(false);

   const [formData, setFormData] =
      useState({

         matchNumber: "",

         map: "Erangel",

         date: "",

         time: "",

      });

   const fetchData =
      async () => {

         try {

            const groupRes =
               await axios.get(
                  `/groups/${id}`
               );

            setGroup(
               groupRes.data.data
            );

            const matchesRes =
               await axios.get(
                  `/matches/group/${id}`
               );

            setMatches(
               matchesRes.data.data
            );

         } catch (error) {

            console.log(error);

            toast.error(
               "Failed to load matches"
            );

         } finally {

            setLoading(false);

         }

      };

   useEffect(() => {

      if (id) {

         fetchData();

      }

   }, [id]);

   const createMatch =
      async () => {

         try {

            setCreating(true);

            await axios.post(
               "/matches",
               {

                  tournamentId:
                     group.tournament,

                  roundId:
                     group.round._id,

                  groupId:
                     group._id,

                  matchNumber:
                     formData.matchNumber,

                  map:
                     formData.map,

                  scheduledAt:
                     `${formData.date}T${formData.time}`,

               }
            );

            toast.success(
               "Match created successfully"
            );

            setShowCreateModal(
               false
            );

            setFormData({

               matchNumber: "",

               map: "Erangel",

               date: "",

               time: "",


            });

            fetchData();

         } catch (error) {

            console.log(error);

            toast.error(
               error?.response?.data?.message ||
               "Failed to create match"
            );

         } finally {

            setCreating(false);

         }

      };

   const saveRoomDetails =
      async () => {

         try {

            await axios.patch(
               `/matches/${selectedMatch._id}/room`,
               {
                  roomId:
                     roomData.roomId,

                  roomPassword:
                     roomData.roomPassword,

                  startTime:
                     roomData.startTime
                        ? `1970-01-01T${roomData.startTime}:00`
                        : null,
               }
            );

            toast.success(
               "Room details updated"
            );

            setShowRoomModal(
               false
            );

            fetchData();

         } catch (error) {

            console.log(error);

            toast.error(
               error?.response?.data?.message ||
               "Failed to update room"
            );

         }

      };

   const updateMatchDetails =
      async () => {

         try {

            await axios.patch(
               `/matches/${selectedMatch._id}`,
               {

                  matchNumber:
                     editData.matchNumber,

                  map:
                     editData.map,

                  scheduledAt:
                     `${editData.date}T${editData.time}`,

               }
            );

            toast.success(
               "Match updated successfully"
            );

            setShowEditModal(
               false
            );

            fetchData();

         } catch (error) {

            console.log(error);

            toast.error(
               error?.response?.data?.message ||
               "Failed to update match"
            );

         }

      };

   if (loading) {

      return (

         <div className="min-h-[70vh] flex items-center justify-center">

            <div className="h-20 w-20 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />

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

         <div className="rounded-3xl border border-orange-400/40 bg-white/[0.03] p-8 shadow-[0_0_45px_rgba(251,146,60,0.22)]">

            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

               <div>

                  <Link
                     href={`/admin/groups/${group._id}`}
                     className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-gray-300 transition hover:border-orange-500/30 hover:bg-orange-500/10 hover:text-white"
                  >

                     <ArrowLeft size={18} />

                     Back

                  </Link>

                  <p className="mt-6 uppercase tracking-[0.3em] text-sm text-orange-400">
                     Match Management
                  </p>

                  <h1 className="mt-3 flex flex-wrap items-center gap-4 text-5xl font-black bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">

                     {group.name}

                     <span className="text-2xl text-white">

                        • {group.round?.name}

                     </span>

                  </h1>

               </div>

               <div className="flex flex-wrap items-center gap-4">

                  <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 px-6 py-4">

                     <p className="text-xs uppercase tracking-[0.25em] text-orange-300">

                        Matches

                     </p>

                     <h2 className="mt-2 text-3xl font-black text-white">

                        {matches.length}

                     </h2>

                  </div>

                  <Link
                     href={`/admin/groups/${group._id}/leaderboard`}
                     className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 font-bold text-white transition hover:scale-105"
                  >

                     <Trophy size={20} />

                     Leaderboard

                  </Link>

                  <button
                     onClick={() =>
                        setShowCreateModal(
                           true
                        )
                     }
                     className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 font-bold text-white transition hover:scale-105"
                  >

                     <Plus size={20} />

                     Create Match

                  </button>

               </div>

            </div>

         </div>

         {/* CONTENT */}

         <div className="mt-10 flex-1 overflow-y-auto pr-2">

            {
               matches.length === 0 ? (

                  <div className="rounded-3xl border border-orange-500/20 bg-white/[0.03] p-16 text-center">

                     <Swords
                        size={70}
                        className="mx-auto text-orange-400"
                     />

                     <h2 className="mt-6 text-4xl font-black text-white">
                        No Matches Yet
                     </h2>

                     <p className="mt-4 text-gray-400">
                        Create matches for this group.
                     </p>

                  </div>

               ) : (

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                     {
                        matches.map(
                           (match) => (

                              <div
                                 key={match._id}
                                 className="rounded-3xl border border-orange-500/20 bg-white/[0.03] p-8 transition hover:border-orange-400/40 hover:bg-orange-500/[0.04]"
                              >

                                 <div className="flex items-start justify-between gap-4">

                                    <div>

                                       {/* <p className="uppercase tracking-[0.25em] text-xs text-orange-400">

                                          Match
                                          {" "}
                                          {match.matchNumber}

                                       </p> */}

                                       <h2 className="mt-3 text-4xl font-black text-white">

                                          {match.name}

                                       </h2>

                                    </div>

                                    <button
                                       onClick={() => {

                                          setSelectedMatch(
                                             match
                                          );

                                          const date =
                                             new Date(
                                                match.scheduledAt
                                             );

                                          setEditData({

                                             matchNumber:
                                                match.matchNumber,

                                             map:
                                                match.map,

                                             date:
                                                date
                                                   .toISOString()
                                                   .split("T")[0],

                                             time:
                                                date
                                                   .toISOString()
                                                   .slice(11, 16),

                                          });

                                          setShowEditModal(
                                             true
                                          );

                                       }}
                                       className="inline-flex items-center gap-2 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-4 font-bold text-cyan-300 transition hover:bg-cyan-500/20"
                                    >

                                       Edit Match

                                    </button>

                                    {
                                       match.status === "completed" ? (

                                          <div className="rounded-2xl bg-green-500/20 px-4 py-2 text-sm font-bold text-green-300">

                                             Completed

                                          </div>

                                       ) : match.roomId &&
                                          match.roomPassword ? (

                                          <div className="rounded-2xl bg-orange-500/20 px-4 py-2 text-sm font-bold text-orange-300">

                                             Ongoing

                                          </div>

                                       ) : (

                                          <div className="rounded-2xl bg-yellow-500/20 px-4 py-2 text-sm font-bold text-yellow-300">

                                             Scheduled

                                          </div>

                                       )
                                    }

                                 </div>

                                 <div className="mt-8 grid grid-cols-2 gap-5">

                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

                                       <div className="flex items-center gap-3 text-orange-300">

                                          <Swords size={18} />

                                          <p className="font-bold">

                                             Map

                                          </p>

                                       </div>

                                       <h2 className="mt-4 text-2xl font-black text-white">

                                          {match.map}

                                       </h2>

                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

                                       <div className="flex items-center gap-3 text-cyan-300">

                                          <CalendarDays size={18} />

                                          <p className="font-bold">

                                             IDP Time

                                          </p>

                                       </div>

                                       <h2 className="mt-4 text-lg font-black text-white">

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

                                       </h2>

                                    </div>

                                 </div>

                                 <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5">

                                    <div className="flex items-center gap-3 text-purple-300">

                                       <Clock3 size={18} />

                                       <p className="font-bold">

                                          Room Details

                                       </p>

                                    </div>

                                    <div className="mt-4 space-y-3 text-gray-300">

                                       {
                                          match.roomId ? (

                                             <>

                                                <p>

                                                   Room ID:
                                                   {" "}
                                                   <span className="font-bold text-white">

                                                      {match.roomId}

                                                   </span>

                                                </p>

                                                <p>

                                                   Password:
                                                   {" "}
                                                   <span className="font-bold text-white">

                                                      {match.roomPassword}

                                                   </span>

                                                </p>

                                                {
                                                   match.startTime && (

                                                      <p>

                                                         Start Time:
                                                         {" "}
                                                         <span className="font-bold text-white">

                                                            {
                                                               new Date(
                                                                  match.startTime
                                                               ).toLocaleTimeString(
                                                                  "en-GB",
                                                                  {

                                                                     hour: "2-digit",

                                                                     minute: "2-digit",

                                                                     hour12: false,

                                                                  }
                                                               )
                                                            }

                                                         </span>

                                                      </p>

                                                   )
                                                }

                                             </>

                                          ) : (

                                             <p className="text-yellow-300">

                                                Room Details Pending

                                             </p>

                                          )
                                       }

                                    </div>

                                 </div>

                                 <div className="mt-8 flex flex-wrap gap-4">

                                    <Link
                                       href={`/admin/matches/${match._id}`}
                                       className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-4 font-bold text-white transition hover:scale-105"
                                    >

                                       Enter Results

                                    </Link>

                                    <button
                                       onClick={() => {

                                          setSelectedMatch(
                                             match
                                          );

                                          setRoomData({

                                             roomId:
                                                match.roomId || "",

                                             roomPassword:
                                                match.roomPassword || "",

                                             startTime:
                                                match.startTime
                                                   ? new Date(
                                                      match.startTime
                                                   )
                                                      .toISOString()
                                                      .slice(11, 16)
                                                   : "",

                                          });

                                          setShowRoomModal(
                                             true
                                          );

                                       }}
                                       className="inline-flex items-center gap-2 rounded-2xl border border-orange-500/20 bg-orange-500/10 px-5 py-4 font-bold text-orange-300 transition hover:bg-orange-500/20"
                                    >

                                       {
                                          match.roomId
                                             ? "Edit Room IDP"
                                             : "Enter Room IDP"
                                       }

                                    </button>

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
            showCreateModal && (

               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-5">

                  <div className="w-full max-w-2xl rounded-3xl border border-orange-500/20 bg-[#111111] p-8">

                     <p className="uppercase tracking-[0.25em] text-xs text-orange-400">
                        Create Match
                     </p>

                     <h2 className="mt-4 text-4xl font-black text-white">

                        New Match

                     </h2>

                     <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* <input
                           type="text"
                           placeholder="Match Name"
                           value={formData.name}
                           onChange={(e) =>
                              setFormData({
                                 ...formData,
                                 name: e.target.value,
                              })
                           }
                           className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none focus:border-orange-500"
                        /> */}

                        <input
                           type="number"
                           placeholder="Match Number"
                           value={formData.matchNumber}
                           onChange={(e) =>
                              setFormData({
                                 ...formData,
                                 matchNumber:
                                    e.target.value,
                              })
                           }
                           className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none focus:border-orange-500"
                        />

                        <select
                           value={formData.map}
                           onChange={(e) =>
                              setFormData({
                                 ...formData,
                                 map: e.target.value,
                              })
                           }
                           className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none focus:border-orange-500"
                        >

                           <option
                              value="Erangel"
                              className="bg-[#111111]"
                           >
                              Erangel
                           </option>

                           <option
                              value="Miramar"
                              className="bg-[#111111]"
                           >
                              Miramar
                           </option>

                           <option
                              value="Rondo"
                              className="bg-[#111111]"
                           >
                              Rondo
                           </option>

                           <option
                              value="Sanhok"
                              className="bg-[#111111]"
                           >
                              Sanhok
                           </option>

                           <option
                              value="Vikendi"
                              className="bg-[#111111]"
                           >
                              Vikendi
                           </option>

                           <option
                              value="Livik"
                              className="bg-[#111111]"
                           >
                              Livik
                           </option>

                        </select>

                        <div>

                           <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-orange-400">

                              IDP Date

                           </p>

                           <div className="relative">

                              <Calendar
                                 size={18}
                                 className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-orange-400"
                              />

                              <input
                                 type="date"
                                 value={formData.date}
                                 onChange={(e) =>
                                    setFormData({
                                       ...formData,
                                       date: e.target.value,
                                    })
                                 }
                                 onKeyDown={(e) =>
                                    e.preventDefault()
                                 }
                                 onFocus={(e) =>
                                    e.target.showPicker?.()
                                 }
                                 className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-4 pl-14 pr-5 text-white outline-none transition focus:border-orange-500 [color-scheme:dark]"
                              />

                           </div>

                        </div>

                        <div>

                           <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-orange-400">

                              IDP Time

                           </p>

                           <div className="relative">

                              <Clock4
                                 size={18}
                                 className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-orange-400"
                              />

                              <input
                                 type="time"
                                 lang="en-GB"
                                 value={formData.time}
                                 onChange={(e) =>
                                    setFormData({
                                       ...formData,
                                       time: e.target.value,
                                    })
                                 }
                                 onKeyDown={(e) =>
                                    e.preventDefault()
                                 }
                                 onFocus={(e) =>
                                    e.target.showPicker?.()
                                 }
                                 className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-4 pl-14 pr-5 text-white outline-none transition focus:border-orange-500 [color-scheme:dark]"
                                 step="60"
                              />

                           </div>

                        </div>

                        {/* <input
                           type="text"
                           placeholder="Room ID"
                           value={formData.roomId}
                           onChange={(e) =>
                              setFormData({
                                 ...formData,
                                 roomId:
                                    e.target.value,
                              })
                           }
                           className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none focus:border-orange-500"
                        />

                        <input
                           type="text"
                           placeholder="Room Password"
                           value={formData.roomPassword}
                           onChange={(e) =>
                              setFormData({
                                 ...formData,
                                 roomPassword:
                                    e.target.value,
                              })
                           }
                           className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none focus:border-orange-500"
                        /> */}

                     </div>

                     <div className="mt-10 flex gap-4">

                        <button
                           onClick={() => {

                              setShowCreateModal(
                                 false
                              );

                              setFormData({

                                 matchNumber: "",

                                 map: "Erangel",

                                 date: "",

                                 time: "",

                              });

                           }}
                           className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 font-bold text-gray-300"
                        >

                           Cancel

                        </button>

                        <button
                           disabled={creating}
                           onClick={createMatch}
                           className="flex-1 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-4 font-bold text-white disabled:opacity-50"
                        >

                           {
                              creating
                                 ? "Creating..."
                                 : "Create Match"
                           }

                        </button>

                     </div>

                  </div>

               </div>

            )
         }

         {
            showRoomModal && (

               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-5">

                  <div className="w-full max-w-xl rounded-3xl border border-orange-500/20 bg-[#111111] p-8 shadow-[0_0_45px_rgba(251,146,60,0.15)]">

                     <p className="uppercase tracking-[0.25em] text-xs text-orange-400">

                        Room Management

                     </p>

                     <h2 className="mt-4 text-4xl font-black text-white">

                        {
                           selectedMatch?.roomId
                              ? "Edit Room"
                              : "Assign Room"
                        }

                     </h2>

                     <div className="mt-8 space-y-5">

                        <input
                           type="text"
                           placeholder="Enter Room ID"
                           value={roomData.roomId}
                           onChange={(e) =>
                              setRoomData({
                                 ...roomData,
                                 roomId:
                                    e.target.value,
                              })
                           }
                           className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none transition focus:border-orange-500"
                        />

                        <input
                           type="text"
                           placeholder="Enter Room Password"
                           value={roomData.roomPassword}
                           onChange={(e) =>
                              setRoomData({
                                 ...roomData,
                                 roomPassword:
                                    e.target.value,
                              })
                           }
                           className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none transition focus:border-orange-500"
                        />

                        <div className="relative">

                           <Clock4
                              size={18}
                              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-orange-400"
                           />

                           <input
                              type="time"
                              lang="en-GB"
                              value={roomData.startTime}
                              onChange={(e) =>
                                 setRoomData({
                                    ...roomData,
                                    startTime:
                                       e.target.value,
                                 })
                              }
                              onKeyDown={(e) =>
                                 e.preventDefault()
                              }
                              onFocus={(e) =>
                                 e.target.showPicker?.()
                              }
                              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-4 pl-14 pr-5 text-white outline-none transition focus:border-orange-500 [color-scheme:dark]"
                              step="60"
                           />

                        </div>

                     </div>

                     <div className="mt-10 flex gap-4">

                        <button
                           onClick={() =>
                              setShowRoomModal(
                                 false
                              )
                           }
                           className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 font-bold text-gray-300"
                        >

                           Cancel

                        </button>

                        <button
                           onClick={
                              saveRoomDetails
                           }
                           className="flex-1 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-4 font-bold text-white"
                        >

                           Save Room

                        </button>

                     </div>

                  </div>

               </div>

            )
         }

         {
            showEditModal && (

               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-5">

                  <div className="w-full max-w-2xl rounded-3xl border border-cyan-500/20 bg-[#111111] p-8 shadow-[0_0_45px_rgba(34,211,238,0.15)]">

                     <p className="uppercase tracking-[0.25em] text-xs text-cyan-400">

                        Match Management

                     </p>

                     <h2 className="mt-4 text-4xl font-black text-white">

                        Edit Match

                     </h2>

                     <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div>

                           <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">

                              Match Number

                           </p>

                           <input
                              type="number"
                              value={editData.matchNumber}
                              onChange={(e) =>
                                 setEditData({
                                    ...editData,
                                    matchNumber:
                                       e.target.value,
                                 })
                              }
                              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none transition focus:border-cyan-500"
                           />

                        </div>

                        <div>

                           <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">

                              Map

                           </p>

                           <select
                              value={editData.map}
                              onChange={(e) =>
                                 setEditData({
                                    ...editData,
                                    map: e.target.value,
                                 })
                              }
                              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none transition focus:border-cyan-500"
                           >

                              <option value="Erangel" className="bg-[#111111]">

                                 Erangel

                              </option>

                              <option value="Miramar" className="bg-[#111111]">

                                 Miramar

                              </option>

                              <option value="Sanhok" className="bg-[#111111]">

                                 Sanhok

                              </option>

                              <option value="Livik" className="bg-[#111111]">

                                 Livik

                              </option>

                              <option value="Vikendi" className="bg-[#111111]">

                                 Vikendi

                              </option>

                              <option value="Rondo" className="bg-[#111111]">

                                 Rondo

                              </option>

                           </select>

                        </div>

                        <div>

                           <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">

                              IDP Date

                           </p>

                           <input
                              type="date"
                              value={editData.date}
                              onChange={(e) =>
                                 setEditData({
                                    ...editData,
                                    date: e.target.value,
                                 })
                              }
                              onKeyDown={(e) =>
                                 e.preventDefault()
                              }
                              onFocus={(e) =>
                                 e.target.showPicker?.()
                              }
                              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none transition focus:border-cyan-500 [color-scheme:dark]"
                           />

                        </div>

                        <div>

                           <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">

                              IDP Time

                           </p>

                           <input
                              type="time"
                              lang="en-GB"
                              value={editData.time}
                              onChange={(e) =>
                                 setEditData({
                                    ...editData,
                                    time: e.target.value,
                                 })
                              }
                              onKeyDown={(e) =>
                                 e.preventDefault()
                              }
                              onFocus={(e) =>
                                 e.target.showPicker?.()
                              }
                              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none transition focus:border-cyan-500 [color-scheme:dark]"
                              step="60"
                           />

                        </div>

                     </div>

                     <div className="mt-10 flex gap-4">

                        <button
                           onClick={() =>
                              setShowEditModal(
                                 false
                              )
                           }
                           className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 font-bold text-gray-300"
                        >

                           Cancel

                        </button>

                        <button
                           onClick={
                              updateMatchDetails
                           }
                           className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-4 font-bold text-white"
                        >

                           Save Changes

                        </button>

                     </div>

                  </div>

               </div>

            )
         }

      </div>

   );

}
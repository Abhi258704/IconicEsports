"use client";

import {
   use,
   useEffect,
   useState,
} from "react";

import Link from "next/link";

import {
   ArrowLeft,
   Users,
   Search,
} from "lucide-react";

import API from "@/lib/axios";

export default function TournamentTeamsPage({
   params,
}) {

   const { id } = use(params);

   const [teams, setTeams] =
      useState([]);

   const [filteredTeams,
      setFilteredTeams] =
      useState([]);

   const [loading, setLoading] =
      useState(true);

   const [search, setSearch] =
      useState("");

   useEffect(() => {
      if (!id) return;

      fetchTeams();
   }, [id]);

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

   const fetchTeams =
      async () => {

          if (!id) return;

         try {

            const res =
               await API.get(
                  `/teams/tournament/${id}`
               );

            setTeams(
               res.data.data
            );

            setFilteredTeams(
               res.data.data
            );

         } catch (error) {

            console.log(error);

         } finally {

            setLoading(false);

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

               <p className="mt-6 uppercase tracking-[0.3em] text-sm text-cyan-400">
                  Tournament Teams
               </p>

               <h1 className="mt-3 text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 bg-clip-text text-transparent">
                  All Teams
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
               placeholder="Search teams..."
               value={search}
               onChange={(e) =>
                  setSearch(
                     e.target.value
                  )
               }
               className="w-full rounded-3xl border border-white/10 bg-white/[0.03] py-5 pl-14 pr-5 text-white outline-none transition focus:border-cyan-500"
            />

         </div>

         {/* SCROLL */}

         <div className="mt-10 flex-1 overflow-y-auto pr-2">

            {
               filteredTeams.length === 0 ? (

                  <div className="rounded-3xl border border-cyan-500/20 bg-white/[0.03] p-16 text-center">

                     <Users
                        size={70}
                        className="mx-auto text-cyan-400"
                     />

                     <h2 className="mt-6 text-3xl font-black text-white">
                        No Teams Found
                     </h2>

                  </div>

               ) : (

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                     {
                        filteredTeams.map(
                           (team) => (

                              <Link
                                 key={team._id}
                                 href={`/admin/teams/${team._id}`}
                                 className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition hover:border-cyan-500/30 hover:bg-cyan-500/[0.03]"
                              >

                                 <div className="flex items-start justify-between gap-4">

                                    <div>

                                       <p className="uppercase tracking-[0.25em] text-xs text-cyan-400">
                                          Registered Team
                                       </p>

                                       <h2 className="mt-3 text-4xl font-black text-white">
                                          {team.teamName}
                                       </h2>

                                    </div>

                                    <div
                                       className={`rounded-2xl px-4 py-2 text-sm font-bold

                                       ${team.status ===
                                             "verified"

                                             ? "bg-green-500/20 text-green-400"

                                             : team.status ===
                                                "rejected"

                                                ? "bg-red-500/20 text-red-400"

                                                : "bg-yellow-500/20 text-yellow-400"
                                          }`}
                                    >

                                       {team.status}

                                    </div>

                                 </div>

                                 {/* INFO */}

                                 <div className="mt-8 grid grid-cols-2 gap-5">

                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

                                       <p className="text-sm text-gray-400">
                                          Players
                                       </p>

                                       <h2 className="mt-3 text-3xl font-black text-white">
                                          {team.players.length}
                                       </h2>

                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

                                       <p className="text-sm text-gray-400">
                                          Group
                                       </p>

                                       <h2 className="mt-3 text-2xl font-black text-white">
                                          {
                                             team.group
                                                ? "Assigned"
                                                : "Pending"
                                          }
                                       </h2>

                                    </div>

                                 </div>

                              </Link>

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
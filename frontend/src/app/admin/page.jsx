"use client";

import {
   Trophy,
   Users,
   ShieldCheck,
   Swords,
   ArrowUpRight,
   Link,
} from "lucide-react";

import { useRouter }
   from "next/navigation";

import {
   useEffect,
   useState,
} from "react";

import API from "@/lib/axios";

export default function AdminPage() {

   const router = useRouter();

   const [stats, setStats] =
      useState(null);

   const [loading, setLoading] =
      useState(true);

   useEffect(() => {

      fetchDashboardStats();

   }, []);

   const fetchDashboardStats =
      async () => {

         try {

            const res =
               await API.get(
                  "/dashboard/stats"
               );

            setStats(
               res.data.data
            );

         } catch (error) {

            console.log(error);

         } finally {

            setLoading(false);

         }

      };

   const cards = [
      {
         title: "Total Tournaments",
         value:
            stats?.totalTournaments || 0,
         icon: Trophy,
      },
      {
         title: "Registered Teams",
         value:
            stats?.registeredTeams || 0,
         icon: Users,
      },
      {
         title: "Pending Verifications",
         value:
            stats?.pendingVerifications || 0,
         icon: ShieldCheck,
      },
      {
         title: "Active Matches",
         value:
            stats?.activeMatches || 0,
         icon: Swords,
      },
   ];

   if (loading) {

      return (

         <div className="min-h-[70vh] flex items-center justify-center">

            <div className="flex flex-col items-center gap-5">

               <div className="h-20 w-20 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />

               <p className="text-gray-400 tracking-widest uppercase text-sm">
                  Loading Dashboard
               </p>

            </div>

         </div>

      );

   }

   return (

      <div className="space-y-10">

         {/* HERO */}

         <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#111] via-[#0d0d0d] to-black p-10">

            <div className="absolute top-0 left-0 h-72 w-72 bg-purple-500/20 blur-3xl rounded-full" />

            <div className="absolute bottom-0 right-0 h-72 w-72 bg-cyan-500/20 blur-3xl rounded-full" />

            <div className="relative z-10">

               <p className="text-purple-400 uppercase tracking-[0.3em] text-sm font-semibold">
                  ICONIC ESPORTS
               </p>

               <h1 className="mt-4 text-6xl font-black leading-tight bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                  Admin Dashboard
               </h1>

               <p className="mt-5 max-w-2xl text-gray-400 text-lg leading-relaxed">
                  Manage tournaments, monitor matches,
                  verify teams and control the esports ecosystem.
               </p>


               <button
                  onClick={() =>
                     router.push(
                        "/admin/tournaments"
                     )
                  }
                  className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-4 font-bold text-white transition hover:scale-105"
               >
                  Manage Tournaments

                  <ArrowUpRight size={18} />
               </button>

            </div>

         </div>

         {/* STATS */}

         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            {cards.map((card) => {

               const Icon = card.icon;

               return (

                  <div
                     key={card.title}
                     className="group relative overflow-hidden rounded-3xl border border-purple-500/20 bg-white/[0.03] p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-purple-500/40"
                  >

                     <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-cyan-500/0 opacity-0 transition duration-500 group-hover:opacity-100 group-hover:from-purple-500/10 group-hover:to-cyan-500/10" />

                     <div className="relative z-10">

                        <div className="flex items-center justify-between">

                           <div className="rounded-2xl bg-purple-500/10 p-4 text-purple-400">
                              <Icon size={28} />
                           </div>

                           <span className="text-xs uppercase tracking-widest text-gray-500">
                              Live
                           </span>

                        </div>

                        <p className="mt-6 text-sm uppercase tracking-[0.2em] text-gray-400">
                           {card.title}
                        </p>

                        <h2 className="mt-3 text-5xl font-black text-white">
                           {card.value}
                        </h2>

                     </div>

                  </div>

               );

            })}

         </div>

      </div>

   );

}
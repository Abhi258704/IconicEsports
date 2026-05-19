"use client";

import {
   useEffect,
   useState,
} from "react";

import {
   useRouter,
} from "next/navigation";

import API
   from "@/lib/axios";

export default function ModeratorPage() {

   const router =
      useRouter();

   const [
      groups,
      setGroups,
   ] = useState([]);

   const [
      loading,
      setLoading,
   ] = useState(true);

   useEffect(() => {

      fetchData();

   }, []);

   const fetchData =
      async () => {

         try {

            const res =
               await API.get(
                  "/moderator/groups"
               );

            setGroups(
               res.data.data
            );

         }

         catch (
         error
         ) {

            console.log(
               error
            );

         }

         finally {

            setLoading(
               false
            );

         }

      };

   const tournaments =

      [

         ...new Map(

            groups.map(
               group => [

                  group
                     .tournament
                     ?._id,

                  group,

               ]
            )

         )

            .values(),

      ];

   if (
      loading
   ) {

      return (

         <div className="min-h-screen flex items-center justify-center">

            <div className="h-20 w-20 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />

         </div>

      );

   }

   return (

      <div className="space-y-10">

         {/* HERO */}

         <div className="rounded-3xl p-10 border border-cyan-500/20 bg-gradient-to-br from-[#111] to-black">

            <p className="uppercase tracking-[0.3em] text-cyan-400">

               MODERATOR PANEL

            </p>

            <h1 className="mt-5 text-6xl font-black">

               Welcome Back

            </h1>

            <p className="mt-4 text-gray-400">

               Manage assigned tournaments.

            </p>

         </div>

         {/* TOURNAMENTS */}

         <div>

            <h2
               className="text-3xl font-black"
            >

               Tournament Details

            </h2>

            {

               tournaments.length ===
               0 && (

                  <div className="mt-8 text-gray-500">

                     No groups assigned

                  </div>

               )

            }

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">

               {

                  tournaments.map(
                     tournament => (

                        <button

                           key={
                              tournament
                                 .tournament
                                 ?._id
                           }

                           onClick={() =>

                              router.push(

                                 `/moderator/tournaments/${tournament.tournament._id}/groups`

                              )

                           }

                           className="h-[260px] rounded-[2rem] border border-cyan-500/20 bg-gradient-to-br from-[#0d0d0d] via-[#111] to-black p-8 text-left transition hover:border-cyan-500/60 hover:-translate-y-1"

                        >

                           <div className="h-full flex flex-col justify-between">

                              <div>

                                 <p className="text-cyan-400 text-sm">

                                    TOURNAMENT

                                 </p>

                                 <h2 className="mt-4 text-4xl font-black">

                                    {

                                       tournament
                                          .tournament
                                          ?.name

                                    }

                                 </h2>

                              </div>

                              <div>

                                 <p className="text-gray-500">

                                    Assigned Groups

                                 </p>

                                 <p className="text-4xl font-black">

                                    {

                                       groups.filter(

                                          group =>

                                             group
                                                .tournament
                                                ?._id ===

                                             tournament
                                                .tournament
                                                ?._id

                                       ).length

                                    }

                                 </p>

                              </div>

                           </div>

                        </button>

                     )

                  )

               }

            </div>

         </div>

      </div>

   );

}
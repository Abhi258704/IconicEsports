"use client";

import {
   useEffect,
   useState,
} from "react";

import {
   useParams,
} from "next/navigation";

import API
   from "@/lib/axios";

import toast
   from "react-hot-toast";

export default function MatchesPage() {

   const {
      teamId
   } =
      useParams();

   const [
      data,
      setData
   ] =
      useState(
         null
      );

   const [
      loading,
      setLoading
   ] =
      useState(
         true
      );

   useEffect(() => {

      const fetchData =
         async () => {

            try {

               const res =

                  await API.get(

                     `/users/my-teams/${teamId}/matches`

                  );

               setData(

                  res.data.data

               );

            }

            catch {

               toast.error(
                  "Failed"
               );

            }

            finally {

               setLoading(
                  false
               );

            }

         };

      fetchData();

   }, [
      teamId
   ]);

   if (
      loading
   ) {

      return (

         <div className="p-5">

            Loading...

         </div>

      );

   }

   return (

      <div className="space-y-5">

         {/* TOP */}

         <div className="rounded-3xl border border-cyan-500/10 bg-white/[0.03] p-6">

            <p className="text-xs tracking-[0.3em] text-cyan-400">

               ALL MATCHES

            </p>

            <h1 className="mt-3 text-4xl font-black">

               {

                  data?.round?.name

                  ||

                  "Current Round"

               }

            </h1>

            <div className="mt-4 flex flex-wrap gap-3">

               <div className="rounded-2xl bg-white/[0.04] px-4 py-3">

                  <p className="text-[10px] tracking-[0.25em] text-gray-500">

                     GROUP

                  </p>

                  <p className="mt-2 font-black">

                     {

                        data?.group?.name

                        ||

                        "Pending"

                     }

                  </p>

               </div>

               <div className="rounded-2xl bg-cyan-500/10 px-4 py-3">

                  <p className="text-[10px] tracking-[0.25em] text-cyan-400">

                     SLOT

                  </p>

                  <p className="mt-2 font-black text-cyan-400">

                     {

                        data?.slot

                        ||

                        "Pending"

                     }

                  </p>

               </div>

            </div>

         </div>

         {

            !data?.matches
               ?.length

            &&

            (

               <div className="rounded-3xl bg-white/[0.03] p-10 text-center">

                  <h2 className="text-2xl font-black">

                     No Matches

                  </h2>

                  <p className="mt-2 text-gray-400">

                     Wait for allocation

                  </p>

               </div>

            )

         }

         <div className="space-y-4">

            {

               data?.matches?.map(

                  (
                     match
                  ) => {

                     const idp =

                        match.scheduledAt

                           ?

                           new Date(
                              match.scheduledAt
                           )

                           :

                           null;

                     const start =

                        match.startTime

                           ?

                           new Date(
                              match.startTime
                           )

                           :

                           null;

                     return (

                        <div

                           key={
                              match._id
                           }

                           className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"

                        >

                           <div className="flex items-center justify-between">

                              <div>

                                 <p className="text-xs tracking-[0.25em] text-cyan-400">

                                    MATCH

                                 </p>

                                 <h2 className="mt-2 text-3xl font-black">

                                    #

                                    {

                                       match.matchNumber

                                    }

                                 </h2>

                              </div>

                              <div className="text-xl font-bold">

                                 {

                                    match.map

                                 }

                              </div>

                           </div>

                           <div className="mt-6 grid grid-cols-2 gap-4">

                              <div>

                                 <p className="text-gray-500">

                                    IDP DATE

                                 </p>

                                 <p className="mt-2">

                                    {

                                       idp

                                          ?

                                          idp.toLocaleDateString()

                                          :

                                          "--"

                                    }

                                 </p>

                              </div>

                              <div>

                                 <p className="text-gray-500">

                                    IDP TIME

                                 </p>

                                 <p className="mt-2 text-cyan-400 font-black">

                                    {

                                       idp

                                          ?

                                          idp.toLocaleTimeString(

                                             "en-GB",

                                             {

                                                hour:
                                                   "2-digit",

                                                minute:
                                                   "2-digit",

                                                hour12:
                                                   false,

                                             }

                                          )

                                          :

                                          "--:--"

                                    }

                                 </p>

                              </div>

                              <div>

                                 <p className="text-gray-500">

                                    ROOM ID

                                 </p>

                                 <p className="mt-2 font-black break-all">

                                    {

                                       match.roomId

                                       ||

                                       "LOCKED"

                                    }

                                 </p>

                              </div>

                              <div>

                                 <p className="text-gray-500">

                                    PASSWORD

                                 </p>

                                 <p className="mt-2 font-black break-all">

                                    {

                                       match.roomPassword

                                       ||

                                       "LOCKED"

                                    }

                                 </p>

                              </div>

                              <div>

                                 <p className="text-gray-500">

                                    START

                                 </p>

                                 <p className="mt-2">

                                    {

                                       start

                                          ?

                                          start.toLocaleTimeString(

                                             "en-GB",

                                             {

                                                hour:
                                                   "2-digit",

                                                minute:
                                                   "2-digit",

                                                hour12:
                                                   false,

                                             }

                                          )

                                          :

                                          "--:--"

                                    }

                                 </p>

                              </div>

                              <div>

                                 <p className="text-gray-500">

                                    STATUS

                                 </p>

                                 <p className="mt-2 font-semibold">

                                    {

                                       match.status
                                          ?.toUpperCase()

                                    }

                                 </p>

                              </div>

                           </div>

                        </div>

                     );

                  }

               )

            }

         </div>

      </div>

   );

}
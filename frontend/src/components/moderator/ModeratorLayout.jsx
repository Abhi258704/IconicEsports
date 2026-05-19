"use client";

import Link from "next/link";

import Image from "next/image";

import {
   Trophy,
   Boxes,
} from "lucide-react";

export default function ModeratorLayout({
   children,
}) {

   return (

      <div className="min-h-screen flex bg-[#050505] text-white">

         <aside className="w-72 border-r border-cyan-500/10 bg-black p-6">

            <div className="mb-14 flex flex-col items-center">

               <div className="relative">

                  <div className="absolute inset-0 rounded-[2rem] bg-cyan-500/20 blur-3xl" />

                  <div className="relative flex h-40 w-40 items-center justify-center rounded-[2rem] border border-cyan-500/20 bg-gradient-to-br from-[#161616] via-black to-[#0b0b0b] overflow-hidden">

                     <Image
                        src="/logo1.png"
                        alt="Iconic"
                        width={220}
                        height={220}
                     />

                  </div>

               </div>

               <div className="mt-6 text-center">

                  <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">

                     MOD PANEL

                  </h1>

                  <p className="mt-2 text-xs text-gray-500">

                     TOURNAMENT OPERATIONS

                  </p>

               </div>

            </div>

            <nav className="flex flex-col gap-4">

               <Link

                  href="/moderator"

                  className="group relative overflow-hidden rounded-2xl border border-transparent bg-white/[0.03] px-5 py-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:bg-cyan-500/[0.06]"

               >

                  <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-gradient-to-r from-cyan-500/10 to-transparent" />

                  <div className="relative flex items-center gap-4">

                     <Trophy
                        className="transition group-hover:scale-110 group-hover:text-cyan-400"
                     />

                     <span className="font-semibold">

                        Dashboard

                     </span>

                  </div>

               </Link>

               <Link

                  href="/moderator/groups"

                  className="group relative overflow-hidden rounded-2xl border border-transparent bg-white/[0.03] px-5 py-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:bg-cyan-500/[0.06]"

               >

                  <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-gradient-to-r from-cyan-500/10 to-transparent" />

                  <div className="relative flex items-center gap-4">

                     <Boxes
                        className="transition group-hover:scale-110 group-hover:text-cyan-400"
                     />

                     <span className="font-semibold">

                        Groups

                     </span>

                  </div>

               </Link>

            </nav>

         </aside>

         <main className="flex-1 p-8 overflow-auto">

            {children}

         </main>

      </div>

   );

}
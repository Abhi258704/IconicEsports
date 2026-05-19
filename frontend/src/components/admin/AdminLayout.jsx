"use client";

import Link from "next/link";
import Image from "next/image";

import {

   Trophy,

   Users,

   Shield,

} from "lucide-react";

export default function AdminLayout({
   children,
}) {

   const navClass =
      "group flex items-center gap-3 px-5 py-4 rounded-2xl border border-transparent bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:bg-purple-500/[0.06]";

   const iconClass =
      "transition group-hover:scale-110 group-hover:text-purple-400";

   return (

      <div className="min-h-screen flex bg-[#050505] text-white">

         {/* SIDEBAR */}

         <aside className="w-72 border-r border-purple-500/20 bg-black p-6">

            <div className="mb-14 flex flex-col items-center">

               <div className="relative">

                  <div className="absolute inset-0 rounded-[2rem] bg-purple-500/30 blur-3xl" />

                  <div className="relative flex h-38 w-38 items-center justify-center rounded-[2rem] border border-purple-500/30 bg-gradient-to-br from-[#161616] via-black to-[#0b0b0b] shadow-[0_0_60px_rgba(168,85,247,0.25)] overflow-hidden">

                     <Image
                        src="/logo1.png"
                        alt="Iconic Esports"
                        width={200}
                        height={200}
                        loading="eager"
                        className="object-contain"
                     />

                  </div>

               </div>

               <div className="mt-6 text-center">

                  <h1 className="text-4xl font-black tracking-wide bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">

                     ICONIC

                  </h1>

                  <p className="mt-2 text-xs uppercase tracking-[0.45em] text-gray-500">

                     ESPORTS CONTROL PANEL

                  </p>

               </div>

            </div>

            <nav className="flex flex-col gap-3">

               <Link
                  href="/admin"
                  className={navClass}
               >
                  <Trophy
                     size={18}
                     className={iconClass}
                  />
                  Dashboard
               </Link>

               <Link
                  href="/admin/tournaments"
                  className={navClass}
               >
                  <Trophy
                     size={18}
                     className={iconClass}
                  />
                  Tournaments
               </Link>

               <Link
                  href="/admin/moderators"
                  className={navClass}
               >

                  <Shield
                     size={18}
                     className={iconClass}
                  />

                  Moderators

               </Link>

                <Link
                  href="/admin/users"
                  className={navClass}
               >

                  <Users
                     size={18}
                     className={iconClass}
                  />

                  Users

               </Link>

               {/* <Link
                  href="/admin/teams"
                  className={navClass}
               >
                  <Users
                     size={18}
                     className={iconClass}
                  />
                  Teams
               </Link>

               <Link
                  href="/admin/rounds"
                  className={navClass}
               >
                  <Layers3
                     size={18}
                     className={iconClass}
                  />
                  Rounds
               </Link> */}

               {/* <Link
                  href="/admin/groups"
                  className={navClass}
               >
                  <Boxes
                     size={18}
                     className={iconClass}
                  />
                  Groups
               </Link>

               <Link
                  href="/admin/matches"
                  className={navClass}
               >
                  <Swords
                     size={18}
                     className={iconClass}
                  />
                  Matches
               </Link> */}

            </nav>

         </aside>

         {/* MAIN */}

         <main className="flex-1 p-8 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.15),transparent_35%),#050505]">

            {children}

         </main>

      </div>

   );

}
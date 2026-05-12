"use client";

import Link from "next/link";
import Image from "next/image";

import {
   Trophy,
   Users,
   Layers3,
   Boxes,
   Swords,
} from "lucide-react";

export default function AdminLayout({
   children,
}) {

   return (

      <div className="min-h-screen flex bg-[#050505] text-white">

         {/* SIDEBAR */}
         <aside className="w-72 border-r border-purple-500/20 bg-black p-6">

            <div className="mb-14 flex flex-col items-center">

               {/* LOGO */}

               <div className="relative">

                  {/* OUTER GLOW */}

                  <div className="absolute inset-0 rounded-[2rem] bg-purple-500/30 blur-3xl" />

                  {/* LOGO BOX */}

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

               {/* BRAND */}

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
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-purple-500/20 transition"
               >
                  <Trophy size={18} />
                  Dashboard
               </Link>

               <Link
                  href="/admin/tournaments"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-purple-500/20 transition"
               >
                  <Trophy size={18} />
                  Tournaments
               </Link>

               <Link
                  href="/admin/teams"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-purple-500/20 transition"
               >
                  <Users size={18} />
                  Teams
               </Link>

               <Link
                   href="/admin/rounds"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-purple-500/20 transition"
               >
                  <Layers3 size={18} />
                  Rounds
               </Link>

               <Link
                  href="/admin/groups"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-purple-500/20 transition"
               >
                  <Boxes size={18} />
                  Groups
               </Link>

               <Link
                  href="/admin/matches"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-purple-500/20 transition"
               >
                  <Swords size={18} />
                  Matches
               </Link>

            </nav>

         </aside>

         {/* MAIN */}
         <main className="flex-1 p-8 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.15),transparent_35%),#050505]">

            {children}

         </main>

      </div>

   );

}
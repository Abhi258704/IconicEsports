"use client";

import {
   useState,
} from "react";

import Link from "next/link";

import Image from "next/image";

import {
   Menu,
   X,
   Trophy,
   ClipboardList,
} from "lucide-react";

export default function UserLayout({
   children,
}) {

   const [
      open,
      setOpen,
   ] =
      useState(false);

   const nav = [

      {

         name:
            "Tournaments",

         href:
            "/user/tournaments",

         icon:
            Trophy,

      },

      {

         name:
            "My Tournaments",

         href:
            "/user/my-tournaments",

         icon:
            ClipboardList,

      },

   ];

   return (

      <div className="min-h-screen bg-[#050505] text-white lg:flex">

         {/* DESKTOP SIDEBAR */}

         <div className="hidden lg:block">

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

                        Welcome

                     </h1>

                     <p className="mt-2 text-xs text-gray-500">

                        PLAYER DASHBOARD

                     </p>

                  </div>

               </div>

               <nav className="flex flex-col gap-4">

                  {

                     nav.map(

                        (item) => {

                           const Icon =
                              item.icon;

                           return (

                              <Link

                                 key={
                                    item.href
                                 }

                                 href={
                                    item.href
                                 }

                                 className="group relative overflow-hidden rounded-2xl border border-transparent bg-white/[0.03] px-5 py-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:bg-cyan-500/[0.06]"

                              >

                                 <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-gradient-to-r from-cyan-500/10 to-transparent" />

                                 <div className="relative flex items-center gap-4">

                                    <Icon

                                       className="transition group-hover:scale-110 group-hover:text-cyan-400"

                                    />

                                    <span className="font-semibold">

                                       {item.name}

                                    </span>

                                 </div>

                              </Link>

                           );

                        }

                     )

                  }

               </nav>

            </aside>

         </div>



         {/* MOBILE */}

         <div className="lg:hidden">

            <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-5 lg:hidden">

               <div className="mx-auto flex h-16 max-w-md items-center rounded-[22px] border border-cyan-400/20 bg-gradient-to-b from-[#121212] via-[#0d0d0d] to-[#090909] px-5 shadow-[0_0_50px_rgba(6,182,212,0.12)] backdrop-blur">

                  <div className="flex w-10 justify-start">

                     <Image

                        src="/logo1.png"

                        alt="logo"

                        width={38}

                        height={38}

                     />

                  </div>

                  <div className="flex flex-1 flex-col items-center leading-none">

                     <h1 className="text-lg font-black">

                        COMPETE

                     </h1>

                     <p className="mt-1 text-[10px] tracking-[0.25em] text-cyan-400">

                        CONQUER

                     </p>

                  </div>

                  <button

                     onClick={() =>
                        setOpen(
                           true
                        )
                     }

                     className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-white/5"

                  >

                     <Menu
                        size={22}
                     />

                  </button>

               </div>

            </header>

         </div>

         {

            open && (

               <>

                  <div

                     onClick={() =>

                        setOpen(
                           false
                        )

                     }

                     className="fixed inset-0 z-40 bg-black/50"

                  ></div>

                  <aside className="fixed left-0 top-0 z-50 h-screen w-72 border-r border-cyan-500/10 bg-[#050505] p-6">

                     <div className="mb-12 flex items-center justify-between">

                        <div>

                           <h2 className="text-3xl font-black">

                              Menu

                           </h2>

                           <p className="mt-1 text-sm text-gray-500">

                              Explore tournaments

                           </p>

                        </div>

                        <button

                           onClick={() =>

                              setOpen(
                                 false
                              )

                           }

                           className="rounded-xl p-2 hover:bg-white/5"

                        >

                           <X />

                        </button>

                     </div>

                     <nav className="space-y-3">

                        {

                           nav.map(

                              (item) => {

                                 const Icon =
                                    item.icon;

                                 return (

                                    <Link

                                       key={
                                          item.href
                                       }

                                       href={
                                          item.href
                                       }

                                       onClick={() =>

                                          setOpen(
                                             false
                                          )

                                       }

                                       className="group relative overflow-hidden rounded-2xl border border-transparent bg-white/[0.03] px-5 py-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:bg-cyan-500/[0.06]"

                                    >

                                       <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-gradient-to-r from-cyan-500/10 to-transparent" />

                                       <div className="relative flex items-center gap-4">

                                          <Icon

                                             className="transition group-hover:scale-110 group-hover:text-cyan-400"

                                          />

                                          <span className="font-semibold">

                                             {
                                                item.name
                                             }

                                          </span>

                                       </div>

                                    </Link>

                                 );

                              }

                           )

                        }

                     </nav>

                  </aside>

               </>

            )

         }



         {/* CONTENT */}

         <main className="flex-1 pt-24 lg:pt-0">

            {children}

         </main>

      </div>

   );

}
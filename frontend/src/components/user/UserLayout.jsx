"use client";

import Image
from "next/image";

export default function UserLayout({
   children,
}) {

   return (

      <div className="min-h-screen flex bg-[#050505] text-white">

         <aside className="w-72 border-r border-cyan-500/20 p-6">

            <div className="flex flex-col items-center">

               <Image
                  src="/logo1.png"
                  alt="Iconic"
                  width={180}
                  height={180}
               />

               <h1 className="mt-6 text-4xl font-black">

                  USER

               </h1>

            </div>

         </aside>

         <main className="flex-1 p-10">

            {children}

         </main>

      </div>

   );

}
"use client";

export default function UserPage() {

   const user =

      typeof window !==
      "undefined"

      ?

      JSON.parse(
         localStorage.getItem(
            "user"
         )
      )

      :

      null;

   return (

      <div>

         <h1
            className="text-6xl font-black"
         >

            Hello

         </h1>

         <p
            className="mt-4 text-gray-400"
         >

            {

               user?.name ||

               "Player"

            }

         </p>

      </div>

   );

}
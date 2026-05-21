"use client";

import API from "@/lib/axios";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function Home() {

   const router = useRouter();

   const [showLogin, setShowLogin] =
      useState(false);

   const initialized =
      useRef(false);

   useEffect(() => {

      if (
         initialized.current
      ) return;

      initialized.current =
         true;

      const checkUser =
         async () => {

            const token =
               localStorage.getItem(
                  "token"
               );

            if (!token) {

               setShowLogin(
                  true
               );

               return;

            }

            try {

               const res =
                  await API.get(
                     "/users/me",
                     {
                        headers: {
                           Authorization:
                              `Bearer ${token}`,
                        },
                     }
                  );

               const user =
                  res.data.data;

               localStorage.setItem(
                  "user",
                  JSON.stringify(user)
               );

               if (
                  user.role ===
                  "admin"
               ) {
                  router.replace(
                     "/admin"
                  );
               }

               else if (
                  user.role ===
                  "moderator"
               ) {
                  router.replace(
                     "/moderator"
                  );
               }

               else {
                  router.replace(
                     "/user"
                  );
               }

            }

            catch {

               localStorage.removeItem(
                  "token"
               );

               localStorage.removeItem(
                  "user"
               );

               setShowLogin(
                  true
               );

            }

         };

      checkUser();

   }, [router]);



   const handleSuccess =
      async (
         credentialResponse
      ) => {

         try {

            const res =
               await API.post(
                  "/auth/google",
                  {
                     credential:
                        credentialResponse
                           .credential,
                  }
               );

            const token =
               res.data.data.token;

            localStorage.setItem(
               "token",
               token
            );

            const me =
               await API.get(
                  "/users/me",
                  {
                     headers: {
                        Authorization:
                           `Bearer ${token}`,
                     },
                  }
               );

            const user =
               me.data.data;

            localStorage.setItem(
               "user",
               JSON.stringify(user)
            );

            router.replace(
               user.role === "admin"
                  ? "/admin"
                  : user.role === "moderator"
                     ? "/moderator"
                     : "/user"
            );

         }

         catch (
         error
         ) {

            console.log(
               error
            );

         }

      };


   if (!showLogin) {

      return (

         <div
            className="

min-h-screen
bg-white

flex
items-center
justify-center

px-5

"

         >

            <div

               className="

w-full
max-w-md

bg-white

rounded-3xl

shadow-[0_25px_80px_rgba(0,0,0,0.12)]

border
border-gray-100

p-10

text-center

"

            >

               <div

                  className="

w-14
h-14

mx-auto

rounded-full

border-[4px]

border-gray-200
border-t-black

animate-spin

"

               />

               <h2

                  className="

mt-8
text-2xl
font-bold

"

               >

                  Loading

               </h2>

               <p

                  className="

mt-2
text-gray-500

"

               >

                  Checking your session...

               </p>

            </div>

         </div>

      );

   }



   return (

      <div
         className="

min-h-screen
bg-white

flex
items-center
justify-center

px-5

"

      >

         <div

            className="

w-full
max-w-md

bg-white

rounded-3xl

shadow-[0_25px_80px_rgba(0,0,0,0.12)]

border
border-gray-100

p-10

text-center

"

         >

            <div
               className="mb-8"
            >

               <h1

                  className="

text-4xl
font-black
tracking-tight

text-black

"

               >

                  ICONIC ESPORTS

               </h1>

               <p

                  className="

mt-3
text-gray-500
text-sm

"

               >

                  Esports Platform

               </p>

            </div>



            <h2

               className="

text-2xl
font-bold

text-gray-900

"

            >

               Welcome

            </h2>

            <p

               className="

text-gray-500
mt-2
mb-8

"

            >

               Continue with Google to access tournaments

            </p>



            <div

               className="

rounded-2xl

shadow-[0_18px_45px_rgba(0,0,0,0.18)]

hover:shadow-[0_22px_55px_rgba(0,0,0,0.22)]

transition-all

"

            >

               <GoogleLogin

                  key="single-google"

                  onSuccess={
                     handleSuccess
                  }

                  onError={() =>
                     console.log(
                        "FAILED"
                     )
                  }

               />

            </div>



            <p

               className="

mt-8
text-xs
text-gray-400

"

            >

               Secure authentication • Enter the Arena

            </p>

         </div>

      </div>

   );

}
"use client";

import axios from "axios";

import {
   GoogleLogin,
}
   from "@react-oauth/google";

import {
   useRouter,
}
   from "next/navigation";

import {
   useEffect,
   useState,
}
   from "react";

export default function Home() {

   const router =
      useRouter();

   const [
      showLogin,
      setShowLogin
   ] =
      useState(false);

   useEffect(() => {

      const checkUser =
         async () => {

            const token =
               localStorage.getItem(
                  "token"
               );

            if (
               !token
            ) {

               setShowLogin(
                  true
               );

               return;

            }

            try {

               const res =
                  await axios.get(

                     "http://localhost:8000/api/v1/users/me",

                     {

                        headers: {

                           Authorization:

                              `Bearer ${token}`

                        }

                     }

                  );

               const user =
                  res.data.data;

               /* sync local */

               localStorage.setItem(

                  "user",

                  JSON.stringify(
                     user
                  )

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

   }, [
      router
   ]);

   const handleSuccess =
      async (
         credentialResponse
      ) => {

         try {

            const res =
               await axios.post(

                  "http://localhost:8000/api/v1/auth/google",

                  {

                     credential:

                        credentialResponse
                           .credential

                  }

               );

            localStorage.setItem(

               "token",

               res.data.data.token

            );

            /* fetch fresh role */

            const me =
               await axios.get(

                  "http://localhost:8000/api/v1/users/me",

                  {

                     headers: {

                        Authorization:

                           `Bearer ${res.data.data.token}`

                     }

                  }

               );

            const user =
               me.data.data;

            localStorage.setItem(

               "user",

               JSON.stringify(
                  user
               )

            );

            if (
               user.role ===
               "admin"
            ) {

               router.push(
                  "/admin"
               );

            }

            else if (
               user.role ===
               "moderator"
            ) {

               router.push(
                  "/moderator"
               );

            }

            else {

               router.push(
                  "/user"
               );

            }

         }

         catch (
         error
         ) {

            console.log(
               error
            );

         }

      };

   if (
      !showLogin
   ) {

      return null;

   }

   return (

      <div className="min-h-screen flex items-center justify-center">

         <GoogleLogin

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

   );

}
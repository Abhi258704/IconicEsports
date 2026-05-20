"use client";

import API from "@/lib/axios";

import {
   GoogleLogin,
} from "@react-oauth/google";

import {
   useRouter,
} from "next/navigation";

import {
   useEffect,
   useState,
   useRef,
} from "react";

export default function Home() {

   const router =
      useRouter();

   const [
      showLogin,
      setShowLogin
   ] =
      useState(false);

   const initialized =
      useRef(false);

   useEffect(() => {

      if (
         initialized.current
      ) {
         return;
      }

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

                     "/api/v1/users/me",

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

   }, [router]);



   const handleSuccess =
      async (
         credentialResponse
      ) => {

         try {

            const res =
               await API.post(

                  "/api/v1/auth/google",

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

                  "/api/v1/users/me",

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

         catch (
         error
         ) {

            console.log(
               "LOGIN ERROR:",
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

   );

}
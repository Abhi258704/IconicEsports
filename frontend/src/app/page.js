"use client";

import axios from "axios";

import { GoogleLogin }
   from "@react-oauth/google";

import { useRouter }
   from "next/navigation";

import {
   useEffect,
   useState,
} from "react";

export default function Home() {

   const router =
      useRouter();

   const [
      showLogin,
      setShowLogin,
   ] = useState(false);

   useEffect(() => {

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

      const user =
         JSON.parse(

            localStorage.getItem(
               "user"
            )

         );

      if (
         user?.role ===
         "admin"
      ) {

         router.replace(
            "/admin"
         );

      }

      else if (

         user?.role ===
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

   }, [router]);

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
                           .credential,
                  }

               );

            localStorage.setItem(

               "token",

               res.data.data.token

            );

            localStorage.setItem(

               "user",

               JSON.stringify(

                  res.data.data.user

               )

            );

            const user =
               res.data.data.user;

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

         catch (error) {

            console.log(
               error
            );

         }

      };

   if (!showLogin) {

      return null;

   }

   return (

      <div className="flex items-center justify-center min-h-screen">

         <GoogleLogin
            onSuccess={
               handleSuccess
            }
            onError={() => {
               console.log(
                  "FAILED"
               );
            }}
         />

      </div>

   );

}
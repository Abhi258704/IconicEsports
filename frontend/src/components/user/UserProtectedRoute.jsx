"use client";

import {
   useEffect,
   useState,
} from "react";

import {
   useRouter,
} from "next/navigation";

import API
from "@/lib/axios";

export default function UserProtectedRoute({
   children,
}) {

   const router =
      useRouter();

   const [
      loading,
      setLoading,
   ] = useState(true);

   useEffect(() => {

      const verify =
         async () => {

            try {

               const token =
                  localStorage.getItem(
                     "token"
                  );

               if (!token) {

                  router.replace(
                     "/"
                  );

                  return;

               }

               const res =
                  await API.get(
                     "/users/me"
                  );

               const user =
                  res.data.data;

               if (

                  user.role !==
                  "user"

               ) {

                  router.replace(
                     "/"
                  );

                  return;

               }

               setLoading(
                  false
               );

            }

            catch {

               router.replace(
                  "/"
               );

            }

         };

      verify();

   }, [router]);

   if (
      loading
   ) {

      return (

         <div className="min-h-screen flex items-center justify-center">

            Loading...

         </div>

      );

   }

   return children;

}
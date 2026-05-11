"use client";

import { useEffect, useState }
   from "react";

import { useRouter }
   from "next/navigation";

import API from "@/lib/axios";

export default function ProtectedRoute({
   children,
}) {

   const router = useRouter();

   const [loading, setLoading] =
      useState(true);

   useEffect(() => {

      const verifyUser = async () => {

         try {

            const token =
               localStorage.getItem(
                  "token"
               );

            if (!token) {
               router.push("/");
               return;
            }

            await API.get(
               "/users/me"
            );

            setLoading(false);

         } catch (error) {

            localStorage.removeItem(
               "token"
            );

            localStorage.removeItem(
               "user"
            );

            router.push("/");

         }

      };

      verifyUser();

   }, [router]);

   if (loading) {

      return (

         <div className="min-h-screen flex items-center justify-center text-white">
            Loading...
         </div>

      );

   }

   return children;

}
import UserLayout
from "@/components/user/UserLayout";

import UserProtectedRoute
from "@/components/user/UserProtectedRoute";

export default function Layout({
   children,
}) {

   return (

      <UserProtectedRoute>

         <UserLayout>

            {children}

         </UserLayout>

      </UserProtectedRoute>

   );

}
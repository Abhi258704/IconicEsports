import ModeratorLayout
from "@/components/moderator/ModeratorLayout";

import ModeratorProtectedRoute
from "@/components/moderator/ModeratorProtectedRoute";

export default function Layout({
   children,
}) {

   return (

      <ModeratorProtectedRoute>

         <ModeratorLayout>

            {children}

         </ModeratorLayout>

      </ModeratorProtectedRoute>

   );

}
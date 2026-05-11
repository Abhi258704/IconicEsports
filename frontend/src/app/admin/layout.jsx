import AdminLayout
from "@/components/admin/AdminLayout";

import ProtectedRoute
from "@/components/admin/ProtectedRoute";

export default function Layout({
   children,
}) {

   return (

      <ProtectedRoute>

         <AdminLayout>
            {children}
         </AdminLayout>

      </ProtectedRoute>

   );

}
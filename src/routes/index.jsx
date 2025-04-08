import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import PrivateLayout from "../layouts/admin/PrivateLayout";
import PrivateLayoutDesa from "../layouts/desa/PrivateLayout";
import PrivateLayoutKelompok from "../layouts/kelompok/PrivateLayout";
import NotFound from "../pages/NotFound";
import Login from "../components/Login";
import { useAuth } from "../context";

// kelompok

const DashboardKelompok = lazy(() =>
  import("../pages/MustLogin/kelompok/Dashboard")
);
// desa
const Kegiatann = lazy(() => import("../pages/MustLogin/desa/Kegiatan"));
const GenerusDesa = lazy(() => import("../pages/MustLogin/desa/GenerusDesa"));
const KehadiranDesa = lazy(() => import("../pages/MustLogin/desa/Kehadiran"));
const DashboardVillage = lazy(() =>
  import("../pages/MustLogin/desa/Dashboard")
);

// Lazy Loading Components
const DashboardAdmin = lazy(() => import("../pages/MustLogin/admin/Dashboard"));
const Daerah = lazy(() => import("../pages/MustLogin/daerah/dashboard"));

const Kegiatan = lazy(() => import("../pages/MustLogin/admin/Kegiatan"));
const Generus = lazy(() => import("../pages/MustLogin/admin/Generus.jsx"));

const ListKelompok = lazy(() =>
  import("../pages/MustLogin/admin/ListKelompok")
);
const ListDesa = lazy(() => import("../pages/MustLogin/admin/ListDesa"));
const GenerusByDesa = lazy(() =>
  import("../pages/MustLogin/admin/GenerusByDesa")
);
const Kehadiran = lazy(() => import("../pages/MustLogin/admin/Kehadiran"));
const Profile = lazy(() => import("../pages/MustLogin/admin/Profile"));

// Komponen untuk memilih layout berdasarkan role
const LayoutSelector = ({ children }) => {
  const { userRole } = useAuth();

  if (userRole === "desa") {
    return <PrivateLayoutDesa>{children}</PrivateLayoutDesa>;
  } else if (userRole === "kelompok") {
    return <PrivateLayoutKelompok>{children}</PrivateLayoutKelompok>;
  } else {
    return <PrivateLayout>{children}</PrivateLayout>;
  }
};

// Fungsi untuk memilih dashboard sesuai peran user
const DashboardSelector = () => {
  const { userRole } = useAuth();

  const dashboardMap = {
    admin: <DashboardAdmin />,
    daerah: <Daerah />,
    desa: <DashboardVillage />,
    kelompok: <DashboardKelompok />,
  };

  return dashboardMap[userRole] || <Navigate to="/login" replace />;
};

// Komponen untuk melindungi route
const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children || <Outlet />;
};

// Komponen untuk menangani login route
const LoginRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />;
};

// Konfigurasi Router dengan Lazy Loading
export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Routes accessible to all authenticated users */}
      <Route element={<ProtectedRoute />}>
        <Route element={<LayoutSelector />}>
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <DashboardSelector />
              </Suspense>
            }
          />
        </Route>
      </Route>

      {/* Routes only accessible to admin, daerah, and kelompok roles */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["admin", "daerah", "kelompok"]} />
        }
      >
        <Route element={<LayoutSelector />}>
          <Route
            path="/kegiatan"
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <Kegiatan />
              </Suspense>
            }
          />
          <Route
            path="/generus"
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <Generus />
              </Suspense>
            }
          />
          <Route
            path="/kelompok"
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <ListKelompok />
              </Suspense>
            }
          />
          <Route
            path="/desa"
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <ListDesa />
              </Suspense>
            }
          />
          <Route
            path="/profile"
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <Profile />
              </Suspense>
            }
          />
          <Route
            path="generusbydesa/:uuid"
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <GenerusByDesa />
              </Suspense>
            }
          />
          <Route
            path="kehadiran/:id_kegiatan"
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <Kehadiran />
              </Suspense>
            }
          />
        </Route>
      </Route>
      {/* desa */}
      <Route element={<ProtectedRoute allowedRoles={["desa"]} />}>
        <Route element={<LayoutSelector />}>
          <Route
            path="/profil"
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <Profile />
              </Suspense>
            }
          />
          <Route
            path="/kelompok/:uuid"
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <GenerusDesa />
              </Suspense>
            }
          />
          <Route
            path="/kegiatann"
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <Kegiatann />
              </Suspense>
            }
          />
          <Route
            path="/kehadirann/:id_kegiatan"
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <KehadiranDesa />
              </Suspense>
            }
          />
        </Route>
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["kelompok"]} />}>
        <Route element={<LayoutSelector />}>
          <Route
            path="/profiles"
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <Profile />
              </Suspense>
            }
          />
        </Route>
      </Route>
      <Route path="/login" element={<LoginRoute />} />
      <Route path="*" element={<NotFound />} />
    </>
  )
);





// import {
//   createBrowserRouter,
//   createRoutesFromElements,
//   Route,
//   Navigate,
//   Outlet,
// } from "react-router-dom";
// import { lazy, Suspense, useState } from "react";
// import ErrorBoundary from "../components/ErrorBoundary";

// // Helper function for retryable dynamic imports
// const retryImport = (importFn, retries = 3, interval = 1000) => {
//   return new Promise((resolve, reject) => {
//     importFn()
//       .then(resolve)
//       .catch((error) => {
//         if (retries <= 0) {
//           reject(error);
//           return;
//         }
//         setTimeout(() => {
//           retryImport(importFn, retries - 1, interval).then(resolve, reject);
//         }, interval);
//       });
//   });
// };

// // Enhanced lazy loading with retry
// const lazyWithRetry = (importFn) => {
//   return lazy(() => retryImport(importFn));
// };
// import PrivateLayout from "../layouts/admin/PrivateLayout";
// import PrivateLayoutDesa from "../layouts/desa/PrivateLayout";
// import PrivateLayoutKelompok from "../layouts/kelompok/PrivateLayout";
// import NotFound from "../pages/NotFound";
// import Login from "../components/Login";
// import { useAuth } from "../context";

// // kelompok

// const DashboardKelompok = lazy(() =>
//   import("../pages/MustLogin/kelompok/Dashboard")
// );
// // desa
// const Kegiatann = lazy(() => import("../pages/MustLogin/desa/Kegiatan"));
// const GenerusDesa = lazy(() => import("../pages/MustLogin/desa/GenerusDesa"));
// const KehadiranDesa = lazy(() => import("../pages/MustLogin/desa/Kehadiran"));
// const DashboardVillage = lazy(() =>
//   import("../pages/MustLogin/desa/Dashboard")
// );

// // Lazy Loading Components
// const DashboardAdmin = lazy(() => import("../pages/MustLogin/admin/Dashboard"));
// const Daerah = lazy(() => import("../pages/MustLogin/daerah/dashboard"));

// const Kegiatan = lazy(() => import("../pages/MustLogin/admin/Kegiatan"));
// const Generus = lazyWithRetry(() => import("../pages/MustLogin/admin/Generus"));
// const ListKelompok = lazy(() =>
//   import("../pages/MustLogin/admin/ListKelompok")
// );
// const ListDesa = lazy(() => import("../pages/MustLogin/admin/ListDesa"));
// const GenerusByDesa = lazy(() =>
//   import("../pages/MustLogin/admin/GenerusByDesa")
// );
// const Kehadiran = lazy(() => import("../pages/MustLogin/admin/Kehadiran"));
// const Profile = lazy(() => import("../pages/MustLogin/admin/Profile"));

// // Komponen untuk memilih layout berdasarkan role
// const LayoutSelector = ({ children }) => {
//   const { userRole } = useAuth();

//   if (userRole === "desa") {
//     return <PrivateLayoutDesa>{children}</PrivateLayoutDesa>;
//   } else if (userRole === "kelompok") {
//     return <PrivateLayoutKelompok>{children}</PrivateLayoutKelompok>;
//   } else {
//     return <PrivateLayout>{children}</PrivateLayout>;
//   }
// };

// // Fungsi untuk memilih dashboard sesuai peran user
// const DashboardSelector = () => {
//   const { userRole } = useAuth();

//   const dashboardMap = {
//     admin: <DashboardAdmin />,
//     daerah: <Daerah />,
//     desa: <DashboardVillage />,
//     kelompok: <DashboardKelompok />,
//   };

//   return dashboardMap[userRole] || <Navigate to="/login" replace />;
// };

// // Komponen untuk melindungi route
// const ProtectedRoute = ({ allowedRoles = [], children }) => {
//   const { isAuthenticated, userRole, loading } = useAuth();

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return children || <Outlet />;
// };

// // Komponen untuk menangani login route
// const LoginRoute = () => {
//   const { isAuthenticated, loading } = useAuth();
//   if (loading) return <p>Loading...</p>;
//   return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />;
// };

// // Konfigurasi Router dengan Lazy Loading
// export const router = createBrowserRouter(
//   createRoutesFromElements(
//     <>
//       {/* Routes accessible to all authenticated users */}
//       <Route element={<ProtectedRoute />}>
//         <Route element={<LayoutSelector />}>
//             <Route
//               path="/dashboard"
//               element={
//                 <Suspense fallback={<div className="p-4">Loading dashboard...</div>}>
//                   <DashboardSelector />
//                 </Suspense>
//               }
//             />
//         </Route>
//       </Route>

//       {/* Routes only accessible to admin, daerah, and kelompok roles */}
//       <Route
//         element={
//           <ProtectedRoute allowedRoles={["admin", "daerah", "kelompok"]} />
//         }
//       >
//         <Route element={<LayoutSelector />}>
//             <Route
//               path="/kegiatan"
//               element={
//                 <ErrorBoundary>
//                   <Suspense fallback={<div className="p-4">Loading Kegiatan module...</div>}>
//                     <Kegiatan />
//                   </Suspense>
//                 </ErrorBoundary>
//               }
//             />
//             <Route
//               path="/generus"
//               element={
//                 <ErrorBoundary>
//                   <Suspense fallback={<div className="p-4">Loading Generus module...</div>}>
//                     <Generus />
//                   </Suspense>
//                 </ErrorBoundary>
//               }
//             />
//           <Route
//             path="/kelompok"
//             element={
//               <ErrorBoundary>
//                 <Suspense fallback={<div className="p-4">Loading Kelompok list...</div>}>
//                   <ListKelompok />
//                 </Suspense>
//               </ErrorBoundary>
//             }
//           />
//           <Route
//             path="/desa"
//             element={
//               <ErrorBoundary>
//                 <Suspense fallback={<div className="p-4">Loading Desa list...</div>}>
//                   <ListDesa />
//                 </Suspense>
//               </ErrorBoundary>
//             }
//           />
//           <Route
//             path="/profile"
//             element={
//               <ErrorBoundary>
//                 <Suspense fallback={<div className="p-4">Loading Profile...</div>}>
//                   <Profile />
//                 </Suspense>
//               </ErrorBoundary>
//             }
//           />
//           <Route
//             path="generusbydesa/:uuid"
//             element={
//               <ErrorBoundary>
//                 <Suspense fallback={<div className="p-4">Loading Generus by Desa...</div>}>
//                   <GenerusByDesa />
//                 </Suspense>
//               </ErrorBoundary>
//             }
//           />
//           <Route
//             path="kehadiran/:id_kegiatan"
//             element={
//               <ErrorBoundary>
//                 <Suspense fallback={<div className="p-4">Loading Kehadiran data...</div>}>
//                   <Kehadiran />
//                 </Suspense>
//               </ErrorBoundary>
//             }
//           />
//         </Route>
//       </Route>
//       {/* desa */}
//       <Route element={<ProtectedRoute allowedRoles={["desa"]} />}>
//         <Route element={<LayoutSelector />}>
//           <Route
//             path="/profil"
//             element={
//               <ErrorBoundary>
//                 <Suspense fallback={<div className="p-4">Loading Profile...</div>}>
//                   <Profile />
//                 </Suspense>
//               </ErrorBoundary>
//             }
//           />
//           <Route
//             path="/kelompok/:uuid"
//             element={
//               <ErrorBoundary>
//                 <Suspense fallback={<div className="p-4">Loading Generus data...</div>}>
//                   <GenerusDesa />
//                 </Suspense>
//               </ErrorBoundary>
//             }
//           />
//           <Route
//             path="/kegiatann"
//             element={
//               <ErrorBoundary>
//                 <Suspense fallback={<div className="p-4">Loading Kegiatan data...</div>}>
//                   <Kegiatann />
//                 </Suspense>
//               </ErrorBoundary>
//             }
//           />
//           <Route
//             path="/kehadirann/:id_kegiatan"
//             element={
//               <ErrorBoundary>
//                 <Suspense fallback={<div className="p-4">Loading Kehadiran data...</div>}>
//                   <KehadiranDesa />
//                 </Suspense>
//               </ErrorBoundary>
//             }
//           />
//         </Route>
//       </Route>
//       <Route element={<ProtectedRoute allowedRoles={["kelompok"]} />}>
//         <Route element={<LayoutSelector />}>
//           <Route
//             path="/profiles"
//             element={
//               <ErrorBoundary>
//                 <Suspense fallback={<div className="p-4">Loading Profile...</div>}>
//                   <Profile />
//                 </Suspense>
//               </ErrorBoundary>
//             }
//           />
//         </Route>
//       </Route>
//       <Route path="/login" element={<LoginRoute />} />
//       <Route path="*" element={<NotFound />} />
//     </>
//   )
// );

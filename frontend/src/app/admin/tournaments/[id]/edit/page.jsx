"use client";

import {
   use,
   useEffect,
   useState,
} from "react";

import {
   useRouter,
} from "next/navigation";

import toast from "react-hot-toast";

import {
   Upload,
} from "lucide-react";

import API from "@/lib/axios";

export default function EditTournamentPage({
   params,
}) {

   const { id } = use(params);

   const router = useRouter();

   const [loading, setLoading] =
      useState(false);

   const [fetching, setFetching] =
      useState(true);

   const [bannerPreview, setBannerPreview] =
      useState(null);

   const [formData, setFormData] =
      useState({
         name: "",
         prizePool: "",
         entryFee: "",
         maxTeams: "",
         teamSize: "",
         maps: [],
         rules: "",
         startDate: "",
         status: "upcoming",
         banner: null,
      });

   useEffect(() => {

      fetchTournament();

   }, []);

   const fetchTournament =
      async () => {

         try {

            const res =
               await API.get(
                  `/tournaments/${id}`
               );

            const tournament =
               res.data.data;

            setBannerPreview(
               tournament.banner
            );

            setFormData({
               name:
                  tournament.name || "",

               prizePool:
                  tournament.prizePool || "",

               entryFee:
                  tournament.entryFee || "",

               maxTeams:
                  tournament.maxTeams || "",

               teamSize:
                  tournament.teamSize || "",

               maps:
                  tournament.maps || [],

               rules:
                  tournament.rules || "",

               status:
                  tournament.status ||
                  "upcoming",

               startDate:
                  tournament.startDate
                     ?.split("T")[0] || "",

               banner: null,
            });

         } catch (error) {

            console.log(error);

         } finally {

            setFetching(false);

         }

      };

   const handleChange = (e) => {

      setFormData({
         ...formData,
         [e.target.name]:
            e.target.value,
      });

   };

   const handleBannerChange =
      (e) => {

         const file =
            e.target.files[0];

         if (!file) return;

         setFormData({
            ...formData,
            banner: file,
         });

         setBannerPreview(
            URL.createObjectURL(file)
         );

      };

   const handleSubmit =
      async (e) => {

         e.preventDefault();

         try {

            setLoading(true);

            const submitData =
               new FormData();

            Object.keys(formData)
               .forEach((key) => {

                  if (key === "maps") {

                     submitData.append(
                        "maps",
                        JSON.stringify(
                           formData.maps
                        )
                     );

                  } else {

                     submitData.append(
                        key,
                        formData[key]
                     );

                  }

               });

            await API.patch(
               `/tournaments/${id}`,
               submitData,
               {
                  headers: {
                     "Content-Type":
                        "multipart/form-data",
                  },
               }
            );

            toast.success(
               "Tournament updated successfully"
            );

            router.push(
               `/admin/tournaments/${id}`
            );

         } catch (error) {

            console.log(error);

            toast.error(
               "Update failed"
            );

         } finally {

            setLoading(false);

         }

      };

   if (fetching) {

      return (

         <div className="min-h-[70vh] flex items-center justify-center">

            <div className="h-20 w-20 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />

         </div>

      );

   }

   return (

      <div className="h-[calc(100vh-64px)] overflow-hidden">

         <div className="h-full overflow-y-auto rounded-3xl border border-purple-500/20 bg-white/[0.03] p-8 backdrop-blur-xl">

            <p className="uppercase tracking-[0.3em] text-sm text-purple-400">
               Tournament Settings
            </p>

            <h1 className="mt-4 text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
               Edit Tournament
            </h1>

            <form
               onSubmit={handleSubmit}
               className="mt-10"
            >

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <Input
                     label="Tournament Name"
                     name="name"
                     value={formData.name}
                     onChange={handleChange}
                  />

                  <Input
                     label="Prize Pool"
                     name="prizePool"
                     type="number"
                     value={formData.prizePool}
                     onChange={handleChange}
                  />

                  <Input
                     label="Entry Fee"
                     name="entryFee"
                     type="number"
                     value={formData.entryFee}
                     onChange={handleChange}
                  />

                  <Input
                     label="Max Teams"
                     name="maxTeams"
                     type="number"
                     value={formData.maxTeams}
                     onChange={handleChange}
                  />

                  <Input
                     label="Team Size"
                     name="teamSize"
                     type="number"
                     value={formData.teamSize}
                     onChange={handleChange}
                  />

                  <div>

                     <label className="text-sm text-gray-400">
                        Status
                     </label>

                     <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition focus:border-purple-500"
                     >

                        <option value="upcoming">
                           Upcoming
                        </option>

                        <option value="ongoing">
                           Ongoing
                        </option>

                        <option value="completed">
                           Completed
                        </option>

                        <option value="cancelled">
                           Cancelled
                        </option>

                     </select>

                  </div>

               </div>

               {/* MAPS */}

               <div className="mt-8">

                  <label className="text-sm text-gray-400">
                     Maps
                  </label>

                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">

                     {[
                        "Erangel",
                        "Miramar",
                        "Sanhok",
                        "Vikendi",
                        "Rondo",
                        "Karakin",
                     ].map((map) => (

                        <label
                           key={map}
                           className={`flex cursor-pointer items-center justify-center rounded-2xl border px-4 py-4 font-semibold transition

                           ${
                              formData.maps.includes(map)
                                 ? "border-purple-500 bg-purple-500/20 text-purple-300"
                                 : "border-white/10 bg-black/20 text-gray-400 hover:border-purple-500/40"
                           }`}
                        >

                           <input
                              type="checkbox"
                              hidden
                              checked={formData.maps.includes(map)}
                              onChange={() => {

                                 if (
                                    formData.maps.includes(map)
                                 ) {

                                    setFormData({
                                       ...formData,

                                       maps:
                                          formData.maps.filter(
                                             (item) =>
                                                item !== map
                                          ),
                                    });

                                 } else {

                                    setFormData({
                                       ...formData,

                                       maps: [
                                          ...formData.maps,
                                          map,
                                       ],
                                    });

                                 }

                              }}
                           />

                           {map}

                        </label>

                     ))}

                  </div>

               </div>

               {/* RULES */}

               <div className="mt-8">

                  <label className="text-sm text-gray-400">
                     Rules
                  </label>

                  <textarea
                     name="rules"
                     rows={5}
                     value={formData.rules}
                     onChange={handleChange}
                     className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition focus:border-purple-500"
                  />

               </div>

               {/* DATE */}

               <div className="mt-8">

                  <Input
                     label="Start Date"
                     name="startDate"
                     type="date"
                     value={formData.startDate}
                     onChange={handleChange}
                  />

               </div>

               {/* BANNER */}

               <div className="mt-8">

                  <label className="text-sm text-gray-400">
                     Tournament Banner
                  </label>

                  <label className="mt-2 flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-purple-500/30 bg-black/20 px-6 py-8 transition hover:border-purple-500">

                     <Upload size={22} />

                     <span>
                        Upload New Banner
                     </span>

                     <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={
                           handleBannerChange
                        }
                     />

                  </label>

               </div>

               {/* PREVIEW */}

               {
                  bannerPreview && (

                     <img
                        src={bannerPreview}
                        alt="Preview"
                        className="mt-6 h-64 w-full rounded-3xl object-cover"
                     />

                  )
               }

               {/* BUTTON */}

               <button
                  type="submit"
                  disabled={loading}
                  className="mt-10 w-full rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-5 text-lg font-black text-white transition hover:scale-[1.01]"
               >

                  {
                     loading
                        ? "Updating..."
                        : "Update Tournament"
                  }

               </button>

            </form>

         </div>

      </div>

   );

}

/* INPUT */

function Input({
   label,
   ...props
}) {

   return (

      <div>

         <label className="text-sm text-gray-400">
            {label}
         </label>

         <input
            {...props}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition focus:border-purple-500"
         />

      </div>

   );

}
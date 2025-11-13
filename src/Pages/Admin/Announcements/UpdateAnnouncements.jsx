import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../../Components/Loader";
import { Toast } from "../../../Components/Toast";
import { toast } from "react-toastify";
import { getApi, putApi } from "../../../Utils/API.js";
import { SERVER_URL, ADMIN_PATH } from "../../../Utils/URLPath.jsx";

const UpdateAnnouncement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Fetch the announcement data by ID
    const fetchAnnouncement = async () => {
      try {
        const response = await getApi(`${SERVER_URL}/api/announcement/${id}`);
        const data = response.data;

        // Set form values
        setValue("title", data.title);
        setValue("description", data.description);
        setValue("date", data.date.split("T")[0]); // Set date in YYYY-MM-DD format

        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch announcement data");
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await putApi(
        data,
        `${SERVER_URL}/api/announcement/${id}`
      );
      if (response.statusCode === 200) {
        toast.success("Announcement updated successfully!");
        setTimeout(() => {
          navigate(`${ADMIN_PATH}/announcements`);
        }, 1000);
      }
    } catch (error) {
      toast.error("Failed to update announcement");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Toast />
      <h2 className="text-2xl font-bold mb-4">Update Announcement</h2>
      <div className="mx-auto p-4 bg-white rounded shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Title Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              {...register("title", {
                required: "Title is required",
              })}
              className={`w-full px-3 py-2 border ${
                errors.title ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-600`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              className={`w-full px-3 py-2 border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-600`}
              rows={4} // Adjust rows as needed
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Date Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              {...register("date", {
                required: "Date is required",
              })}
              className={`w-full px-3 py-2 border ${
                errors.date ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-600`}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Submit Announcement
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateAnnouncement;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Loader from "../../../Components/Loader";
import { Toast } from "../../../Components/Toast.jsx";
import { postApi } from "../../../Utils/API";
import { toast } from "react-toastify";
import { ADMIN_PATH, SERVER_URL } from "../../../Utils/URLPath";
import { useNavigate } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

const AddAnnouncement = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().split("T")[0], // Set default date to today
    },
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await postApi(data, `${SERVER_URL}/api/announcement`);

      if (response.statusCode === 201) {
        toast.success("Announcement Added Successfully!");

        setTimeout(() => {
          navigate(`${ADMIN_PATH}/announcements`);
        }, 1000);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <>
          <Toast />
          <Loader />
        </>
      ) : (
        <>
          <Toast />

          <MdOutlineKeyboardBackspace
            size={35}
            className="hover:text-blue-600 cursor-pointer"
            onClick={() => navigate(`${ADMIN_PATH}/announcements`)}
          />

          <h2 className="text-2xl font-bold mb-4">Add Announcement</h2>
          <div className="mx-auto p-4 bg-white rounded shadow-md">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Title */}
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

              {/* Description */}
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
                  rows="4"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Date */}
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.date.message}
                  </p>
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
      )}
    </>
  );
};

export default AddAnnouncement;

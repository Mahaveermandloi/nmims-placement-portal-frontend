import { useState } from "react";
import { useForm } from "react-hook-form"; // Ensure you import useForm correctly
import { toast } from "react-toastify";
import Loader from "../../../Components/Loader.jsx";
import { putApi } from "../../../Utils/API.js";
import { SERVER_URL } from "../../../Utils/URLPath.jsx";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { Toast } from "../../../Components/Toast.jsx";

export const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch, // Add watch here
    reset,
  } = useForm();

  // Handle form submission
  const onSubmit = async (data) => {
    // Ensure new password matches confirmation
    if (data.newPassword !== data.confirmNewPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }

    const payload = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    };

   
    try {
      setLoading(true);
      const response = await putApi(
        payload,
        `${SERVER_URL}/api/student/update-student-password`
      );
      setLoading(false);

      if (response.statusCode === 200) {
        toast.success("Password updated successfully");

        reset();
      } else {
        toast.error("Failed to update password. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error updating password:", error);
      // toast.error("An error occurred while updating the password.");
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <Toast />
      <h3 className="font-serif w-full font-bold text-lg text-gray-800 flex-shrink-0 pr-4 py-4">
        Change Password
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="font-serif">
        {/* Current Password */}
        <div className="mb-6 relative">
          <label htmlFor="currentPassword" className="block mb-2">
            Current Password:
          </label>
          <input
            type={showCurrentPassword ? "text" : "password"}
            id="currentPassword"
            {...register("currentPassword", { required: true })}
            className="border rounded p-2 w-full"
          />
          <div
            className="absolute inset-y-0 right-3 top-8 flex items-center cursor-pointer"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            {showCurrentPassword ? <FaEyeSlash /> : <FaRegEye />}
          </div>
          {errors.currentPassword && (
            <p className="text-red-500 text-sm">
              Current password is required.
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="mb-6 relative">
          <label htmlFor="newPassword" className="block mb-2">
            New Password:
          </label>
          <input
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            {...register("newPassword", {
              required: true,
              pattern: {
                value: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
                message:
                  "Password must contain at least one capital letter, one number, and be at least 8 characters long.",
              },
            })}
            className="border rounded p-2 w-full"
          />
          <div
            className="absolute inset-y-0 right-3 top-5 flex items-center cursor-pointer"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <FaEyeSlash /> : <FaRegEye />}
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-sm">
              {errors.newPassword.message || "New password is required."}
            </p>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="mb-6 relative">
          <label htmlFor="confirmNewPassword" className="block mb-2">
            Confirm New Password:
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmNewPassword"
            {...register("confirmNewPassword", {
              required: true,
              validate: (value) =>
                value === watch("newPassword") || "Passwords do not match.",
            })}
            className="border rounded p-2 w-full"
          />
          <div
            className="absolute inset-y-0 right-3 top-5 flex items-center cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaRegEye />}
          </div>
          {errors.confirmNewPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmNewPassword.message ||
                "Confirm password is required."}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center mt-10 gap-10">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Save
          </button>
        </div>

        {loading && <Loader />}
      </form>
    </>
  );
};

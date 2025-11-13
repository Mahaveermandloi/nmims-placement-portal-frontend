import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ADMIN_PATH, SERVER_URL } from "../../../Utils/URLPath";
import { getApi, postApi } from "../../../Utils/API";
import Loader from "../../../Components/Loader";
import { Toast } from "../../../Components/Toast";
import { useNavigate } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { FiMinus } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";

const JobUploadDetails = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(false); // State to control the loader
  const [showCriteria, setShowCriteria] = useState(false); // State to toggle criteria fields

  const [selectedSpecializations, setSelectedSpecializations] = useState([]);

  const handleSpecializationChange = (event) => {
    const { value } = event.target;
    setSelectedSpecializations(
      (prev) =>
        prev.includes(value)
          ? prev.filter((spec) => spec !== value) // Remove if already selected
          : [...prev, value] // Add if not already selected
    );
  };

  const navigate = useNavigate();
  const {
    register: registerJob,
    handleSubmit: handleSubmitJob,
    formState: { errors: errorsJob },
  } = useForm();

  useEffect(() => {
    // Fetch companies
    const fetchCompanies = async () => {
      try {
        const response = await getApi(
          `${SERVER_URL}/api/company/get-all-companies`
        );

        if (response.statusCode === 200) {
          setCompanies(response.data);
        } else {
          toast.error("Failed to fetch companies");
        }
      } catch (error) {
        toast.error("Error fetching companies");
      }
    };

    // Generate previous years
    const currentYear = new Date().getFullYear();
    const previousYears = Array.from({ length: 4 }, (_, i) => currentYear - i);
    setYears(previousYears);

    fetchCompanies();
  }, []);

  const onSubmitJob = async (data) => {
    setLoading(true); // Show loader
    const jobData = {
      ...data,
      company_id: selectedCompanyId,
      ctc: data.ctc,
      engineering_specialization: selectedSpecializations, // Include selected specializations
    };
  

    try {
      const response = await postApi(jobData, `${SERVER_URL}/api/joblisting`);

      if (response.statusCode === 201) {
        toast.success("Job data uploaded successfully");
        setTimeout(() => {
          navigate(`${ADMIN_PATH}/job-listings`);
        }, 2000);
      }
    } catch (error) {
      toast.error("Failed to upload job data");
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <>
      <Toast />
      <MdOutlineKeyboardBackspace
        size={35}
        className="hover:text-blue-600 cursor-pointer"
        onClick={() => navigate(`${ADMIN_PATH}/job-listings`)}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Add Job Profile</h1>
        {/* Add Criteria Button */}
      </div>

      <form onSubmit={handleSubmitJob(onSubmitJob)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="company_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Company Name
            </label>
            <select
              id="company_name"
              className={`block w-full p-3 border rounded-md ${
                errorsJob.company_name ? "border-red-500" : "border-gray-300"
              }`}
              {...registerJob("company_name", {
                required: "Company name is required",
                onChange: (e) => setSelectedCompanyId(e.target.value),
              })}
            >
              <option value="">Select Company</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.company_name}
                </option>
              ))}
            </select>
            {errorsJob.company_name && (
              <p className="text-red-500 text-sm mt-1">
                {errorsJob.company_name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Year
            </label>
            <select
              id="year"
              className={`block w-full p-3 border rounded-md ${
                errorsJob.year ? "border-red-500" : "border-gray-300"
              }`}
              {...registerJob("year", { required: "Year is required" })}
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errorsJob.year && (
              <p className="text-red-500 text-sm mt-1">
                {errorsJob.year.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="job_title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Job Title
            </label>
            <input
              type="text"
              id="job_title"
              placeholder="Enter Job Title"
              className={`block w-full p-3 border rounded-md ${
                errorsJob.job_title ? "border-red-500" : "border-gray-300"
              }`}
              {...registerJob("job_title", {
                required: "Job title is required",
              })}
            />
            {errorsJob.job_title && (
              <p className="text-red-500 text-sm mt-1">
                {errorsJob.job_title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="job_description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Job Description
            </label>
            <textarea
              id="job_description"
              placeholder="Enter Job Description"
              className={`block w-full p-3 border rounded-md ${
                errorsJob.job_description ? "border-red-500" : "border-gray-300"
              }`}
              {...registerJob("job_description", {
                required: "Job description is required",
              })}
            />
            {errorsJob.job_description && (
              <p className="text-red-500 text-sm mt-1">
                {errorsJob.job_description.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="job_type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Job Type
            </label>
            <input
              type="text"
              id="job_type"
              placeholder="Enter Job Type"
              className={`block w-full p-3 border rounded-md ${
                errorsJob.job_type ? "border-red-500" : "border-gray-300"
              }`}
              {...registerJob("job_type", {
                required: "Job type is required",
              })}
            />
            {errorsJob.job_type && (
              <p className="text-red-500 text-sm mt-1">
                {errorsJob.job_type.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              placeholder="Enter Location"
              className={`block w-full p-3 border rounded-md ${
                errorsJob.location ? "border-red-500" : "border-gray-300"
              }`}
              {...registerJob("location", {
                required: "Location is required",
              })}
            />
            {errorsJob.location && (
              <p className="text-red-500 text-sm mt-1">
                {errorsJob.location.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="ctc"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              CTC
            </label>
            <input
              type="text"
              id="ctc"
              placeholder="Enter CTC"
              className={`block w-full p-3 border rounded-md ${
                errorsJob.ctc ? "border-red-500" : "border-gray-300"
              }`}
              {...registerJob("ctc", {
                required: "CTC is required",
              })}
            />
            {errorsJob.ctc && (
              <p className="text-red-500 text-sm mt-1">
                {errorsJob.ctc.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="application_deadline"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Application Deadline
            </label>
            <input
              type="date"
              id="application_deadline"
              className={`block w-full p-3 border rounded-md ${
                errorsJob.application_deadline
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              {...registerJob("application_deadline", {
                required: "Application deadline is required",
              })}
            />
            {errorsJob.application_deadline && (
              <p className="text-red-500 text-sm mt-1">
                {errorsJob.application_deadline.message}
              </p>
            )}
          </div>
        </div>

        <div className="my-10 ">
          <div className="flex justify-between  items-center mb-5">
            <div className="">
              <p className="text-2xl font-semibold">Eligibility Criteria</p>
            </div>

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              onClick={() => setShowCriteria((prev) => !prev)} // Toggle the criteria fields
              type="button"
            >
              {showCriteria ? (
                <>
                  <FiMinus />
                </>
              ) : (
                <>
                  <FaPlus />
                </>
              )}
            </button>
          </div>

          <hr className="my-5" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {showCriteria && (
              <>
                <div>
                  <label
                    htmlFor="tenth_standard_percentage"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    10th Standard Percentage
                  </label>
                  <input
                    type="text"
                    id="tenth_standard_percentage"
                    placeholder="Enter 10th Standard Percentage"
                    className="block w-full p-3 border rounded-md"
                    {...registerJob("tenth_standard_percentage")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="twelfth_standard_percentage"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    12th Standard Percentage
                  </label>
                  <input
                    type="text"
                    id="twelfth_standard_percentage"
                    placeholder="Enter 12th Standard Percentage"
                    className="block w-full p-3 border rounded-md"
                    {...registerJob("twelfth_standard_percentage")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="engineering_specialization"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Engineering Specialization
                  </label>
                  <div className="flex flex-col">
                    {/* Options for specializations */}
                    {[
                      "Computer Science",
                      "Computer Engineering",
                      "Information Technology",
                      "Artificial Intelligence and Machine Learning",
                    ].map((specialization) => (
                      <div
                        key={specialization}
                        className="flex items-center mb-2"
                      >
                        <input
                          type="checkbox"
                          id={specialization}
                          value={specialization}
                          className="mr-2"
                          checked={selectedSpecializations.includes(
                            specialization
                          )}
                          onChange={handleSpecializationChange}
                        />
                        <label
                          htmlFor={specialization}
                          className="text-sm font-medium text-gray-700"
                        >
                          {specialization}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cgpa_sixth_semester_third_year"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    CGPA (Aggregate)
                  </label>
                  <input
                    type="text"
                    id="cgpa_sixth_semester_third_year"
                    placeholder="Enter CGPA Aggregate"
                    className="block w-full p-3 border rounded-md"
                    {...registerJob("cgpa_sixth_semester_third_year")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="total_dead_kts"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Total Dead KTs
                  </label>
                  <input
                    type="number"
                    id="total_dead_kts"
                    placeholder="Enter Total Dead KTs"
                    className="block w-full p-3 border rounded-md"
                    {...registerJob("total_dead_kts")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="total_live_kts"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Total Live KTs
                  </label>
                  <input
                    type="number"
                    id="total_live_kts"
                    placeholder="Enter Total Live KTs"
                    className="block w-full p-3 border rounded-md"
                    {...registerJob("total_live_kts")}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {!loading ? (
          <>
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition"
              disabled={loading} // Disable button while loading
            >
              Submit
            </button>
          </>
        ) : (
          <>
            <Loader />
          </>
        )}
      </form>
    </>
  );
};

export default JobUploadDetails;

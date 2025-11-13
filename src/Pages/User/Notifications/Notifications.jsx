import React, { useState, useEffect } from "react";
import Loader from "../../../Components/Loader";
import { getApi } from "../../../Utils/API";
import { putApi } from "../../../Utils/API";
import { RxCross1 } from "react-icons/rx";

const Notifications = () => {
  const [announcements, setAnnouncements] = useState([]); // Initialized useState as an empty array
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state for better error handling

  useEffect(() => {
    const getAnnouncements = async () => {
      const SAPID = localStorage.getItem("SAPID");

      try {
        const response = await getApi("/api/announcement");

        if (response.statusCode === 200) {
          if (response.data.length > 0) {
            // Sort the announcements by date in descending order
            const sortedAnnouncements = response.data.sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            );

            setAnnouncements(sortedAnnouncements);

           

         
            const announcementIds = sortedAnnouncements
              .filter(
                (announcement) =>
                  Array.isArray(announcement.status) &&
                  !announcement.status.includes(SAPID)
              )
              .map((announcement) => announcement._id);
 // This should now show correct values

            // Call the function to mark these announcements as read
            if (announcementIds.length > 0) {
              readAnnouncement(announcementIds);
            }
          } else {
            setAnnouncements([]); // No announcements available
          }
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setError("Failed to fetch announcements");
      } finally {
        setLoading(false);
      }
    };

    const readAnnouncement = async (announcementIds) => {
      const SAPID = localStorage.getItem("SAPID");
      const payload = {
        announcementIds: announcementIds,
        student_sap_no: SAPID,
      };

      try {
        const response = await putApi(payload, "/api/announcement");
        if (response.statusCode === 200) {
          // Optionally update the announcements based on the response after marking them as read
          if (response.data.length > 0) {
            setAnnouncements(response.data);
          } else {
            setAnnouncements([]); // No announcements available after marking as read
          }
        }
      } catch (error) {
        console.error("Error reading announcements:", error);
      }
    };

    getAnnouncements();
  }, []);

  if (loading) {
    return <Loader />; // Show loader while loading
  }

  if (error) {
    return <p>{error}</p>; // Display error if any
  }

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-4">Notifications</h1>

      {announcements.length > 0 ? (
        announcements.map((announcement) => (
          <NotificationCard
            key={announcement._id}
            title={announcement.title} // Include title
            description={announcement.description} // Include description
            date={announcement.date} // Include date
          />
        ))
      ) : (
        <p>No announcements available.</p>
      )}
    </div>
  );
};

export default Notifications;

const NotificationCard = ({
  title, // Added title prop
  description, // Added description prop
  date, // Added date prop
}) => {
  const [isExpanded, setIsExpanded] = useState(false); // State to manage expansion

  const toggleExpand = () => {
    setIsExpanded(!isExpanded); // Toggle the expanded state
  };

  return (
    <div className="relative bg-white shadow-lg rounded-lg p-6 mb-4 transition-transform transform hover:shadow-2xl duration-300 ease-in-out">
      {/* Close Icon */}
      <RxCross1
        className="absolute top-3 right-3 text-gray-500 cursor-pointer hover:text-red-500"
        size={20}
      />

      {/* Announcement Details */}
      <div className="text-gray-700">
        <p className="mb-2 font-bold text-xl">
          {title} {/* Display Title */}
        </p>
        <p className="mb-2">
          {" "}
          {isExpanded ? description : `${description.split("\n")[0]}...`}{" "}
          <button onClick={toggleExpand} className="text-blue-500  ml-2">
            {isExpanded ? "Read less" : "Read more"}
          </button>
        </p>
        <p className="mb-2">
          {" "}
          {new Date(date).toLocaleDateString()} {/* Display Date */}
        </p>
      </div>
    </div>
  );
};

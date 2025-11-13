
import React, { useState, useEffect } from "react";
import CompanyCard from "../Companies/Components/CompanyCard.jsx";
import { getApi } from "../../../Utils/API.js";
import { useNavigate } from "react-router-dom";
import nodata from "../../../../public/images/no-data.png";
import Loader from "../../../Components/Loader.jsx";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  const navigate = useNavigate();

  // Fetch companies data from API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true); // Set loading to true when starting to fetch data
        const data = await getApi("/api/company/get-all-companies"); // Adjust route if needed
        setCompanies(data.data);
        setFilteredCompanies(data.data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        setError("Failed to fetch companies. Please try again later.");
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Update filteredCompanies when selectedYear changes
  useEffect(() => {
    if (companies.length > 0) {
      const filtered = companies.filter(
        (company) => company.year === selectedYear
      );
      setFilteredCompanies(filtered);
    }
  }, [selectedYear, companies]);

  // Handle year filter change
  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  // Generate years for dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - i);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Companies</h1>
        <div>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">Filter By Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader /> {/* Ensure you have a Loader component */}
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredCompanies.length === 0 ? (
        <div className="flex justify-center items-center">
          <img src={nodata} alt="No Data Available" className="w-48 h-48" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => (
            <CompanyCard
              key={company._id}
              company={{
                name: company.company_name, // Adjust field names according to your API response
                logo: company.company_logo,
                year: company.year,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Companies;

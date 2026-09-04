import axios from "axios";
import { useState, useEffect } from "react";
import "./App.css";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {

  // STATES

  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reports, setReports] = useState([]);
  const [riskLevel, setRiskLevel] = useState("Medium");
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState("All");
  const [loading, setLoading] = useState(true);

  const totalReports = reports.length;

  const highRiskReports =
    reports.filter(
      (report) => report.riskLevel === "High"
    ).length;

  const mediumRiskReports =
    reports.filter(
      (report) => report.riskLevel === "Medium"
    ).length;

  const safeReports =
    reports.filter(
      (report) => report.riskLevel === "Safe"
    ).length;


  // LOAD DATA FROM BACKEND

  useEffect(() => {

    axios
      .get(`${API_URL}/reports`)
      .then((response) => {

        setReports(response.data);
        setLoading(false);

      })
      .catch((error) => {

        console.log(error);
        setLoading(false);

      });

  }, []);


  // SUBMIT / UPDATE FUNCTION

  const handleSubmit = async (e) => {

    e.preventDefault();

    const newReport = {
      location,
      description,
      riskLevel,
    };

    try {

      if (editId) {

        await axios.put(
          `${API_URL}/report/${editId}`,
          newReport
        );

      } else {

        await axios.post(
          `${API_URL}/report`,
          newReport
        );

      }

      alert("Report Submitted Successfully 🚀");

      setSubmitted(true);

      const response = await axios.get(
        `${API_URL}/reports`
      );

      setReports(response.data);

      setEditId(null);

      // RESET FORM

      setLocation("");
      setDescription("");
      setRiskLevel("Medium");

    } catch (error) {

      console.log(error);
      alert("Something went wrong. Please try again.");

    }

  };


  // DELETE FUNCTION

  const deleteReport = async (id) => {

    if (
      !window.confirm(
        "Are you sure you want to delete this report?"
      )
    ) {
      return;
    }

    try {

      await axios.delete(
        `${API_URL}/report/${id}`
      );

      const updatedReports =
        reports.filter(
          (report) => report._id !== id
        );

      setReports(updatedReports);

    } catch (error) {

      console.log(error);

    }

  };


  // EDIT FUNCTION

  const editReport = (report) => {

    setLocation(report.location);

    setDescription(
      report.description
    );

    setRiskLevel(
      report.riskLevel
    );

    setEditId(report._id);

  };


  return (

    <div className="container">

      <h1>
        AI Unsafe Area Detector 🚨
      </h1>


      <div className="stats-box">

        <h3>
          Total Reports: {totalReports}
        </h3>

        <h3>
          High Risk: {highRiskReports}
        </h3>

        <h3>
          Medium Risk: {mediumRiskReports}
        </h3>

        <h3>
          Safe: {safeReports}
        </h3>

      </div>


      <form
        className="report-form"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          placeholder="Enter Location"
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
        />


        <textarea
          placeholder="Describe the area"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        ></textarea>


        <select
          value={riskLevel}
          onChange={(e) =>
            setRiskLevel(e.target.value)
          }
        >

          <option value="High">
            High Risk
          </option>

          <option value="Medium">
            Medium Risk
          </option>

          <option value="Safe">
            Safe
          </option>

        </select>


        <button type="submit">

          {editId
            ? "Update Report ✏️"
            : "Submit Report 🚀"}

        </button>

      </form>


      <input
        type="text"
        placeholder="Search by Location..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
      />


      <select
        value={filterRisk}
        onChange={(e) =>
          setFilterRisk(e.target.value)
        }
      >

        <option value="All">
          All Risks
        </option>

        <option value="High">
          High Risk
        </option>

        <option value="Medium">
          Medium Risk
        </option>

        <option value="Safe">
          Safe
        </option>

      </select>


      {
        submitted && (
          <p className="success-message">
            Report Submitted Successfully ✅
          </p>
        )
      }


      {
        loading && (
          <h2>
            Loading Reports...
          </h2>
        )
      }


      {
        !loading && reports.length === 0 && (
          <h2>
            No Reports Found 🚫
          </h2>
        )
      }


      {
        reports
          .filter((report) =>
            report.location
              .toLowerCase()
              .includes(
                searchTerm.toLowerCase()
              )
          )
          .filter((report) =>
            filterRisk === "All"
              ? true
              : report.riskLevel === filterRisk
          )
          .map((report, index) => (

            <div
              key={report._id || index}
              className={`report-card ${report.riskLevel}`}
            >

              <h3>
                {report.location}
              </h3>

              <p>
                {report.description}
              </p>

              <h4>
                Risk: {report.riskLevel}
              </h4>


              <button
                onClick={() =>
                  editReport(report)
                }
              >
                Edit
              </button>


              <button
                onClick={() =>
                  deleteReport(report._id)
                }
              >
                Delete
              </button>

            </div>

          ))
      }

    </div>

  );

}

export default App;
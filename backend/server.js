require("dotenv").config();
//report model ko use krna hai taaki mongodb use kr ske
const Report = require("./models/Report");
//mongodb tools import
const mongoose = require("mongoose");
const cors = require("cors");

//express project ko project me la
const express = require("express"); 
//express server create kro
const app = express();
//json data express ko smjhane k liye
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected 😎");
})
.catch((error) => {
  console.log(error);
});
//api route    user kua mang rha hai,server kya bhjra hai
app.get("/", (req, res) => {
    //browserko text bhj do
  res.send("Backend Running 🚀");
});
//post api
app.post("/report", async (req, res) => {

  try {

    const newReport = new Report({
      location: req.body.location,
      description: req.body.description,
      riskLevel: req.body.riskLevel,
    });

    await newReport.save();

    res.json({
      message: "Report Saved Successfully 😎",
    });

  } catch (error) {

    res.status(500).json({
      message: "Something went wrong",
    });

  }

});
//get api
app.get("/reports", async (req, res) => {

  try {

    const reports = await Report.find();

    res.json(reports);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching reports"
    });

  }

});

//delete api haai yaani frontend se data delete hoga toh mongodb se bhi hoga
app.delete("/report/:id", async (req, res) => {

  try {

    await Report.findByIdAndDelete(req.params.id);

    res.json({
      message: "Report Deleted Successfully"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});
//upadte api hai phle data react state me update hota tha ab mongo db se bh hoga
app.put("/report/:id", async (req, res) => {

  try {

    const updatedReport =
      await Report.findByIdAndUpdate(

        req.params.id,

        {
          location: req.body.location,
          description: req.body.description,
          riskLevel: req.body.riskLevel
        },

        { new: true }

      );

    res.json(updatedReport);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});
//server ko port 5000 pe chalao port=gate/door
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
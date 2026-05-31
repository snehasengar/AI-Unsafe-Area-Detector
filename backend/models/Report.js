const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({

  location: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  riskLevel: {
    type: String,
    required: true,
  },

});

module.exports = mongoose.model("Report", reportSchema);
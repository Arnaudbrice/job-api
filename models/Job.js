const mongoose = require("mongoose");
//********** defines the schema for the job model **********
const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, " please provide company name"],
      maxLength: 50
    },
    position: {
      type: String,
      required: [true, "please provide position"],
      maxLength: 100
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"], //status muss be one of these values
      default: "pending"
    },
    // one to one relationship ( a single job can be created by only 1 user)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //reference to the User model
      required: [true, "please provide user"]
    }
  },
  {
    timestamps: true //add automatically 2 fields createdAt and updatedAt to the schema
  }
);

//********** create the Job model based on the schema **********

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;

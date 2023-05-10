const mongoose = require("mongoose");
const { PLACE_AREAS,PLCAE_CATEGORY,STATUS } = require("../config/utils");

const SericeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique:[true,"Service Name must be unique"],
      required: [true, "Service Name is required"],
    },
    description: {
      type: String,
      trim: true,
      default:"No Description",
      required: [true, "Place Description is required"],
    }
  },
  { timestamps: true }
);


const Service =  mongoose.model("Service", SericeSchema, "Service");
module.exports = {Service}

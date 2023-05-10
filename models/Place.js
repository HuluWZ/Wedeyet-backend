const mongoose = require("mongoose");
const { PLACE_AREAS,PLCAE_CATEGORY,STATUS } = require("../config/utils");

const PlaceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Place Name is required"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Place Description is required"],
    },
    area: {
      type: String,
      enum: PLACE_AREAS,
      required: [true, "Place Area is required"],
    },
    phoneNumber: {
      type: String,
      trim: true,
      minlength: 9,
      maxlength:13,
      unique:[true,"Phone Number must be unique"],
      required: [true, "Phone Number is required"],
    },
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref:"Service",
      required: [true, "Place Category is required"],
    },
    address: {
      type: String,
      required: [true, "Place Relative is required!.Eg. Skylight Building"],
    },
    telegram: { type: String, trim: true, required: [true, "Telegram Username is required"] },
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'],
        // default:"Point", // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
    }
  },
    images: [{ type: String, required: [true, "Place Image is required"] }],
    branches: [{
      name: { type: String, required: [true, "Place Branch is required"] },
      location: { type: String, required: [true, "Place Branch Location is required"] },
    }],
    openHours:{
      Monday:  { type:String,required:[true,"Monday Opening and Closing Hour is required"],default:"8:30AM - 5:30PM"}  ,
      Tuesday: { type: String, required: [true, "Tuesday Opening and Closing Hour is required"],default:"8:30AM - 5:30PM" },
      Wednsday: { type: String, required: [true, "Wednsday Opening and Closing Hour is required"],default:"8:30AM - 5:30PM" },
      Thursday: { type: String, required: [true, "Thursday Opening and Closing Hour is required"],default:"8:30AM - 5:30PM" },
      Friday: { type: String, required: [true, "Friday Opening and Closing Hour is required"],default:"8:30AM - 5:30PM" },
      Saturday: { type: String, required: [true, "Saturday Opening and Closing Hour is required"],default:"8:30AM - 12:30PM" },
      Sunday: { type: String,required:[true,"Sunday Opening and Closing Hour is required"],default:"Closed" },
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref:"User"
    }
  },
  { timestamps: true }
);


const Place =  mongoose.model("Place", PlaceSchema, "Place");
module.exports = {Place}

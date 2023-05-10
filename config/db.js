require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

mongoose.connect(process.env.REMOTE_MONGODB_URL);

mongoose.set("runValidators", true);

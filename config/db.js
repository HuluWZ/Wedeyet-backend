const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", true);

mongoose.connect(process.env.REMOTE_MONGODB_URL);

mongoose.set("runValidators", true);

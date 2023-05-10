const { Service } = require("../models/Service");
const { PLCAE_CATEGORY } = require("../config/utils");


let allData = []
// GET ALL PLACE
const getAsObject = (arr) => { 
  arr.forEach((item) => {
    allData.push({name:item,description:"No Description"});
  });
  return allData;
}

//  CREATE Service
exports.createService = async (req, res, next) => {
  try {
    let ServiceData = req.body;
    const newService = await Service.create(ServiceData);
    res
      .status(201)
      .send({
        Service: newService,
        message: "Service Created Saved Succesfully !",
      });
    
    await newService.save();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//  GET PLACE
exports.getService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id)
    // Add Query by Category and Area also
    // console.log(service, id)
    if (!service) {
      return res.status(404).send({ message: "Service not found" });
    }

    return res.status(200).send({ Service:service });
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

// UPDATE PLACE
exports.updateService = async (req, res, next) => {
  try {
     const newServiceInfo = req.body;
     const {id} = req.params;  
     const updatedService = await Service.findOneAndUpdate(
        { _id: id },
        newServiceInfo,
        { new: true }
      );
      return res
        .status(202)
        .send({ Service:updatedService, message: "Service Updated Succesfully !" });
   
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message });
    return res.status(404).send({ message: error });
  }
};


// Delete place
exports.deleteService = async (req, res) => {
  try {
    const {id} = req.params;
    await Service.deleteOne({ _id: id });
      return res
        .status(200)
        .send({ message: "Service has been Deleted Succesfully !" });
    
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message });
    return res.status(404).send({ message: error });
  }
};


exports.getAllServices = async (req, res) => {
  try {
    const getAll = await Service.find({});
    return res
      .status(202)
      .send({
        TotalServices:getAll.length,
        Services: getAll,
      });
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message });
    return res.status(404).send({ message: error });
  }
};

exports.insertAllServices = async (req, res) => {
  try {
    const data = getAsObject(PLCAE_CATEGORY)
    const getAll = await Service.insertMany(data);
    return res
      .status(202)
      .send({
        "Service ":data
      });
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message });
    return res.status(404).send({ message: error });
  }
};
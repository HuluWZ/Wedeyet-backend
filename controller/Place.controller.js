const { Place } = require("../models/Place");
const uploadToCloud  = require("../config/cloudnary")
const { sign } = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const { compareSync } = require("bcrypt");


const  valueStringToArray = (valueString) =>{
    return valueString.substr(0, valueString.length - 1).substr(1).split(',');
}
const getUploadedImage = async (file)=>{
  const uploadedUrls = await uploadToCloud(file.filename);
  return uploadedUrls.url
}
//  CREATE PLACE
exports.createPlace = async (req, res, next) => {
  try {
    let placeData = req.body;
    console.log(placeData.location);
    placeData.location.coordinates = valueStringToArray(placeData.location.coordinates)
    // console.log(placeData.location);
    const newPlace = await Place.create(placeData);
    const file = req.file
    const { url } = await uploadToCloud(file.filename)
    // console.log("URL IS: ",url)
    newPlace.images = url
    res
      .status(201)
      .send({
        Place: newPlace,
        message: "Place Created Saved Succesfully !",
      });

    await newPlace.save();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//  GET PLACE
exports.getPlace = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findById(id).populate("category", { name: 1 });
    // Add Query by Category and Area also
    if (!place) {
      return res.status(404).send({ message: "Place not found" });
    }

    return res.status(200).send({ Place:place });
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

exports.searchPlace = async (req, res) => {
  try {
    const { area, category, name } = req.query;
    const query = { area: area ? new RegExp(area,'i') : { $exists: true }, name: name ? new RegExp(name, 'i') : { $exists: true } }
    let place;
    console.log(query,category)
    if (category) {
      place = await Place.find(query).populate({ path: "category", match: { name: new RegExp(category, 'i') }, select: 'name -_id' })
      place = place.filter((place) => place.category !== null)
      // console.log(place)
    } else {
      place = await Place.find(query);
    }
    // console.log(place)
    if (!place) {
      return res.status(404).send({ message: "Place not found" });
    }
    // console.log(place)

    return res.status(200).send({ SearchResult:place.length,Place:place });
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};
// UPDATE PLACE
exports.updatePlace = async (req, res, next) => {
  try {
    var newPlaceInfo = req.body;
    const { id } = req.params;
    var images, updateInfo;
    // console.log(req.files[0]?"True":"False")
    // const placeInfo = await Place.findById(id)
    if (newPlaceInfo.location) {
      newPlaceInfo.location.coordinates = valueStringToArray(newPlaceInfo.location.coordinates)
    }
    
    
    if (req.files[0]) {
      images = await getUploadedImage(req.files[0])
    } 
    
    console.log(images)
    updateInfo =  images?{$set: newPlaceInfo, $push: { images: images }} : {$set:newPlaceInfo}
    // console.log(images)
    console.log(updateInfo)
    const updatedPlace = await Place.updateOne({ _id: id }, updateInfo);
    return res
        .status(202)
      .send({ Place: updatedPlace, message: "Place Updated Succesfully !" });
    
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message });
    return res.status(404).send({ message: error });
  }
};

// APPROVE PLACE
exports.approvePlace = async (req, res, next) => {
  try {
    const { id } = req.params;
  
    const updatedPlace = await Place.findOneAndUpdate(
      { _id: id },
      {status:"Approved"},
      { new: true }
    );
    return res
      .status(202)
      .send({ Place:updatedPlace,message: "Place Approved Succesfully !" });
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message });
    return res.status(404).send({ message: error });
  }
};
// Delete place
exports.deletePlace = async (req, res) => {
  try {
      const { id } = req.params;
      await Place.deleteOne({ _id: id });
      return res
        .status(200)
        .send({ message: "Place has been Deleted Succesfully !" });
    
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message });
    return res.status(404).send({ message: error });
  }
};


exports.getAllPlaces = async (req, res) => {
  try {
    const getAll = await Place.find({}).populate("category");
    return res
      .status(202)
      .send({
        TotalPlaces:getAll.length,
        Places: getAll,
      });
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message });
    return res.status(404).send({ message: error });
  }
};


exports.uploadImage = async (req, res) => {
  try {
    const placeId = req.params.id;
    // console.log("Welcome")
    const image = req.file
    const uploadedUrls = await uploadToCloud(image.filename);
    // console.log(uploadedUrls,image)
    const updatedPlace = await Place.updateOne(
      { _id: placeId },
      { $push: { images:uploadedUrls.url } },
      { new: true }
    );

    return res
        .status(200)
      .send({
        ImageURL: uploadedUrls.url,
        message: "Place Image has been Uploaded Succesfully !"
      });
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message });
    return res.status(404).send({ message: error });
  }
};

exports.uploadMultipleImage = async (req, res)=>{
   try {
     const placeId = req.params.id;
     var imageURLList = []
     for (let i = 0; i < req.files.length; i++){
       const currentFile = req.files[i].filename
       const uploadedUrls = await uploadToCloud(currentFile);
       imageURLList.push(uploadedUrls.url)
     }
   
     console.log(imageURLList);
    const updatedPlace = await Place.updateOne(
      { _id: placeId },
      { $push: { images:imageURLList } },
      { new: true }
    );

    return res
        .status(200)
      .send({
        ImageURL: imageURLList,
        message: "Place Image has been Uploaded Succesfully !"
      });
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message });
    return res.status(404).send({ message: error });
  }
}
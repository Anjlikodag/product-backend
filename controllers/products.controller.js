const fs =require("fs");

const {
    isValid,
    isValidString,
  isValidObject,
  
} = require("../utils");

const productsModel=require("../models/product.model");


const getAllProducts = async (req, res) => {
    const response = {
      success: true,
      code: 200,
      message: "Product List",
      error: null,
      data: null,
      resourse: req.originalUrl,
    };
    try {
      const products = await productsModel.find({ 
        isDeleted: false,   
        userId: res.locals.userId,
      });
      response.data = { products };
      return res.status(200).json(response);
    } catch (error) {
      response.error = error;
      response.message = error.message;
      response.code = error.code ? error.code : 500;
      return res.status(500).json(response);
    };
  };
  
  const getProductById = async (req, res) => {
    const { productId } = req.params;
    console.log({ productId });
    const response = {
      success: true,
      code: 200,
      message: "producs details",
      error: null, data: null, resource: req.originalUrl,
    };
    try {
      const Product = await productsModel.findOne({ _id: productId });
      if (!Product) throw new Error("Product does not exist");
      response.data = { Product };
      return res.status(200).json(response);
    } catch (error) {
      response.error = error;
      response.message = error.message;
      response.code = error.code ? error.code : 500;
      return res.status(500).json(response);
    }
  };
  
  
  
  const createProduct = async (req, res) => {
    const body1 = req.body
    console.log(body1);
    const response = {
      success: true,
      code: 200,
      message: "Product Created Succesfully",
      error: null,
      data: null,
      resourse: req.originalUrl,
    }
    if (!isValid(body1) && !isValidObject(body1)) {
      response.success = false;
      response.code = 400;
      response.message = "Invalid request data";
      response.error = "Invalid requset data";
      return res.status(400).json(response);
    }
  
    if (!isValid(body1.name) || (isValid(body1.name) && !isValidString(body1.name))) {
      response.success = false;
      response.code = 400;
      response.message = "Invalid request data.Name is reqired";
      response.error = "Invalid request data.Name is reqired";
      return res.status(400).json(response);
    }
  
    try {
      const newProduct = await productsModel.create({
        name: body1.name.trim(),
        userId: res.locals.userId,
        description:body1.description,
        price:body1.price,
        quantity:body1.quantity,
        category: body1.category,
        subcategory: body1.subcategory,
        publisheddate: body1.publisheddate,
        isDeleted: false,
      });
      response.data = { products: newProduct };
      return res.status(201).json(response);
    } catch (error) {
      response.error = error;
      response.code = error.code ? error.code : 500;
      return res.status(500).json(response);
    }
  };
  
  
  const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const productData = req.body;
    if (!(productData) || (isValid(productData) && !isValidObject(productData))) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "Empty request body, nothing to update.",
        error: null,
        data: null,
        resource: req.originalUrl,
      });
    }
    if (!isValid(productData.name) || isValid(productData.name) && !isValidString(productData.name)) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "Empty Product name, no updated.",
        error: null,
        data: null,
        resource: req.originalUrl,
      });
    }
    try {
      const isProductExist = await productsModel.findOne({ _id: productId, isDeleted: false });
      if (!isProductExist)
        return res.status(400).json({
          success: false,
          code: 404,
          message: "Invalid request Product item not exist.",
          error: null,
          data: null,
          resource: req.originalUrl,
        });
      if(isProductExist.userId.toString()!==res.locals.userId){
        return res.status(403).json({
          success: false,
          code: 403,
          message: "Unauthorise user, user not owner",
          data: null,
          error: null,
          resource: req.originalUrl,
        })
      }
      const updatedProduct = await productsModel.findByIdAndUpdate(
        productId,
        { $set: productData },
        { new: true }   // findByIdAndUpdate is take three parameter('where to update', 'updated data', 'if you want to show updated data( make true)')
      );
      await updatedProduct.save();
      return res.status(200).json({
        success: true,
        code: 200,
        message: "Product updated successfully",
        error: null,
        data: { Product: updatedProduct },
        resource: req.originalUrl,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        code: 404,
        message: error.message,
        error: error,
        data: null,
        resource: req.originalUrl,
      });
    }
  };
  
  const deleteProduct = async (req, res) => {
    const { productId } = req.params;  
    console.log(res.locals.userId);
  
    try {
      const isProductExist = await productsModel.findOne({ _id: productId, isDeleted: false });
  
      if (!isProductExist)
        throw new Error("Invalid Product id. Product does not exist with this id.");
      if (isProductExist.userId.toString() !== res.locals.userId) {
        return res.status(403).json({
          success: false,
          code: 403,
          message: "Unauthorise user, user not owner",
          data: null,
          error: null,
          resource: req.originalUrl,
        });
      }
      isProductExist.isDeleted = true,
      isProductExist.deletedAt = new Date().toISOString();
      await isProductExist.save();
  
      return res.status(200).json({
        success: true,
        code: 200,
        message: "Product deleted successfully",
        error: null,
        data: { Product: isProductExist },
        resource: req.originalUrl,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        code: 404,
        message: error.message,
        error: error,
        data: null,
        resource: req.originalUrl,
      });
    }
  };
  
  
  module.exports = {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
  }
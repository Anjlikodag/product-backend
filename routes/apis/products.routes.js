const express = require("express");

const { productscontroller } = require("../../controllers");

const router = express.Router();

router.get("/",  productscontroller.getAllProducts); 
router.get("/:productId",productscontroller.getProductById);
router.post("/", productscontroller.createProduct);
router.put("/:productId", productscontroller.updateProduct);
router.delete("/:productId",  productscontroller.deleteProduct);


module.exports = router;
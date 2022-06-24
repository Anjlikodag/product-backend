const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({

    userId: {
         type: mongoose.SchemaTypes.ObjectId, ref: "User" },

    name: {
         type: String, 
         require: true
         },

    description: {
         type: String,
          require: true },
    price: { type: String,
         require: true
     },

    quantity: { 
        type: String, 
        require: true 
    },

    category: { 
        type: String, 
        require: true 
    },

    subcategory: [String],
    createdAt: {
         type: Date, 
         defalut: new Date()
         },

    modifiedAt: {
         type: Date,
          defalut: new Date()
         },

    isDeleted: { 
        type: Boolean,
         defalut: false
         },

    deletedAt: {
         type: Date, 
         defalut: null 
        },
},
    { timestamps: true }
);

module.exports = mongoose.model("Products", productsSchema);
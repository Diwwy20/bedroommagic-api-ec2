const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema(
  {
    fileName: {  
      type: String,
      required: true
    },
    feature: {  
      type: [Number],
      required: true
    },
    category: {  
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feature', featureSchema);
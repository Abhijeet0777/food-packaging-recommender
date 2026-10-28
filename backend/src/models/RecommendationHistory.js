const mongoose = require('mongoose');

const recommendationHistorySchema = new mongoose.Schema({
  commodityName: { type: String, required: true },
  commodityCategory: { type: String },
  commodityInputs: { type: Object, required: true },
  userPriorities: {
    shelfLife: { type: Number, default: 40 },
    sustainability: { type: Number, default: 30 },
    cost: { type: Number, default: 20 },
    physicalProtection: { type: Number, default: 10 }
  },
  topRecommendations: [
    {
      materialId: String,
      materialName: String,
      materialCode: String,
      overallScore: Number,
      rank: Number,
      barrierScore: Number,
      sustainabilityScore: Number,
      costScore: Number,
      preservationScore: Number,
      predictedShelfLifeDays: Number,
      whyRecommended: [String],
      keyTradeoffs: [String],
      activePackagingAddons: [String]
    }
  ],
  rulesFiredCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RecommendationHistory', recommendationHistorySchema);

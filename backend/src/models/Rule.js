const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  priority: { type: Number, default: 50 },
  description: { type: String, required: true },
  triggerCondition: { type: String, required: true },
  action: { type: String, required: true },
  disqualificationTarget: { type: String },
  targetProperty: { type: String },
  optimalThreshold: { type: Number },
  acceptableThreshold: { type: Number },
  threshold: { type: Number },
  penaltyScore: { type: Number },
  scientificExplanation: { type: String, required: true },
  activePackagingAddon: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rule', ruleSchema);

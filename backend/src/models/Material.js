const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  wvtr: { type: Number, required: true }, // Water Vapor Transmission Rate (g/m2/day)
  otr: { type: Number, required: true }, // Oxygen Transmission Rate (cc/m2/day)
  co2tr: { type: Number, default: 0 },
  uvBarrierScore: { type: Number, min: 1, max: 10, required: true },
  greaseResistance: { type: Number, min: 1, max: 12, required: true },
  tensileStrength: { type: Number }, // MPa
  punctureResistance: { type: String, enum: ['Low', 'Medium', 'Medium-High', 'High', 'Very High', 'Very High (Rigid)'] },
  coldCrackTempC: { type: Number, default: 0 },
  maxTempC: { type: Number, default: 100 },
  minTempC: { type: Number, default: 0 },
  typicalThicknessMicrons: { type: Number },
  recyclabilityCode: { type: String },
  isRecyclable: { type: Boolean, default: false },
  isBiodegradable: { type: Boolean, default: false },
  compostability: { type: String, default: 'None' },
  costIndex: { type: Number, min: 1, max: 5, default: 3 },
  carbonFootprintKgCO2PerKg: { type: Number },
  sustainabilityScore: { type: Number, min: 0, max: 100, default: 50 },
  foodContactApproved: { type: Boolean, default: true },
  certifications: [String],
  strengths: [String],
  limitations: [String],
  idealFor: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Material', materialSchema);

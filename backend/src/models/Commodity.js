const mongoose = require('mongoose');

const commoditySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  moistureContent: { type: Number, required: true }, // %
  waterActivity: { type: Number, required: true }, // aw (0.0 - 1.0)
  fatContent: { type: Number, required: true }, // %
  fatType: { type: String, enum: ['none', 'saturated', 'monounsaturated', 'polyunsaturated', 'unsaturated'], default: 'none' },
  respirationRate: { type: String, enum: ['none', 'low', 'medium', 'high', 'very_high'], default: 'none' },
  ethyleneSensitivity: { type: String, enum: ['none', 'low', 'medium', 'high'], default: 'none' },
  ethyleneProduction: { type: String, enum: ['none', 'low', 'medium', 'high'], default: 'none' },
  lightSensitivity: { type: String, enum: ['none', 'low', 'medium', 'high', 'very_high'], default: 'low' },
  odorTransmissionRisk: { type: String, enum: ['low', 'medium', 'high', 'very_high'], default: 'medium' },
  targetShelfLifeDays: { type: Number, required: true },
  storageTempC: { type: Number, default: 20 },
  pH: { type: Number, default: 7.0 },
  primaryFailureMode: { type: String, required: true },
  secondaryFailureMode: { type: String },
  requiresLightBlock: { type: Boolean, default: false },
  nitrogenFlushingRecommended: { type: Boolean, default: false },
  requiresBreathingPermeability: { type: Boolean, default: false },
  requiresDegassingValve: { type: Boolean, default: false },
  requiresPunctureResistance: { type: Boolean, default: false },
  coldCrackResistanceRequired: { type: Boolean, default: false },
  recommendedAtmosphere: {
    o2: Number,
    co2: Number,
    n2: Number
  },
  maxWVTRRequired: { type: Number }, // g/m2/day
  maxOTRRequired: { type: Number }, // cc/m2/day
  minGreaseResistance: { type: Number, default: 1 },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Commodity', commoditySchema);

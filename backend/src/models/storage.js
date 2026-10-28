const mongoose = require('mongoose');
const Commodity = require('./Commodity');
const Material = require('./Material');
const Rule = require('./Rule');
const RecommendationHistory = require('./RecommendationHistory');
const { defaultCommodities, defaultMaterials, defaultRules } = require('../data/seedData');

// In-memory local stores for fallback
let memoryCommodities = JSON.parse(JSON.stringify(defaultCommodities));
let memoryMaterials = JSON.parse(JSON.stringify(defaultMaterials));
let memoryRules = JSON.parse(JSON.stringify(defaultRules));
let memoryHistory = [];

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

const storage = {
  // Commodities
  async getCommodities() {
    if (isMongoConnected()) {
      try {
        const count = await Commodity.countDocuments();
        if (count === 0) {
          await this.seedAll();
        }
        return await Commodity.find().lean();
      } catch (e) {
        console.warn('Mongo read error, using memory fallback:', e.message);
      }
    }
    return memoryCommodities;
  },

  async getCommodityById(id) {
    if (isMongoConnected()) {
      try {
        return await Commodity.findOne({ id }).lean();
      } catch (e) {
        console.warn('Mongo read error, using memory fallback:', e.message);
      }
    }
    return memoryCommodities.find(c => c.id === id) || null;
  },

  async createCommodity(commodityData) {
    const newDoc = {
      ...commodityData,
      id: commodityData.id || `custom-${Date.now()}`,
      createdAt: new Date()
    };

    if (isMongoConnected()) {
      try {
        return await Commodity.create(newDoc);
      } catch (e) {
        console.warn('Mongo write error, writing to memory:', e.message);
      }
    }
    memoryCommodities.push(newDoc);
    return newDoc;
  },

  // Materials
  async getMaterials() {
    if (isMongoConnected()) {
      try {
        const count = await Material.countDocuments();
        if (count === 0) {
          await this.seedAll();
        }
        return await Material.find().lean();
      } catch (e) {
        console.warn('Mongo read error, using memory fallback:', e.message);
      }
    }
    return memoryMaterials;
  },

  async getMaterialById(id) {
    if (isMongoConnected()) {
      try {
        return await Material.findOne({ id }).lean();
      } catch (e) {
        console.warn('Mongo read error, using memory fallback:', e.message);
      }
    }
    return memoryMaterials.find(m => m.id === id) || null;
  },

  async createMaterial(materialData) {
    const newDoc = {
      ...materialData,
      id: materialData.id || `material-${Date.now()}`,
      createdAt: new Date()
    };

    if (isMongoConnected()) {
      try {
        return await Material.create(newDoc);
      } catch (e) {
        console.warn('Mongo write error, writing to memory:', e.message);
      }
    }
    memoryMaterials.push(newDoc);
    return newDoc;
  },

  // Rules
  async getRules() {
    if (isMongoConnected()) {
      try {
        const count = await Rule.countDocuments();
        if (count === 0) {
          await this.seedAll();
        }
        return await Rule.find().lean();
      } catch (e) {
        console.warn('Mongo read error, using memory fallback:', e.message);
      }
    }
    return memoryRules;
  },

  // History
  async saveRecommendation(recData) {
    const newDoc = {
      ...recData,
      createdAt: new Date()
    };

    if (isMongoConnected()) {
      try {
        return await RecommendationHistory.create(newDoc);
      } catch (e) {
        console.warn('Mongo history write error, saving to memory:', e.message);
      }
    }
    memoryHistory.unshift(newDoc);
    if (memoryHistory.length > 50) memoryHistory.pop();
    return newDoc;
  },

  async getHistory(limit = 20) {
    if (isMongoConnected()) {
      try {
        return await RecommendationHistory.find().sort({ createdAt: -1 }).limit(limit).lean();
      } catch (e) {
        console.warn('Mongo history read error, reading memory:', e.message);
      }
    }
    return memoryHistory.slice(0, limit);
  },

  // Seed All Data to MongoDB
  async seedAll() {
    if (isMongoConnected()) {
      console.log('Seeding data to MongoDB Atlas...');
      await Commodity.deleteMany({});
      await Material.deleteMany({});
      await Rule.deleteMany({});

      await Commodity.insertMany(defaultCommodities);
      await Material.insertMany(defaultMaterials);
      await Rule.insertMany(defaultRules);
      console.log('✅ MongoDB Atlas seeded successfully.');
      return { success: true, target: 'atlas' };
    } else {
      memoryCommodities = JSON.parse(JSON.stringify(defaultCommodities));
      memoryMaterials = JSON.parse(JSON.stringify(defaultMaterials));
      memoryRules = JSON.parse(JSON.stringify(defaultRules));
      console.log('✅ In-memory database reset to defaults.');
      return { success: true, target: 'memory' };
    }
  }
};

module.exports = storage;

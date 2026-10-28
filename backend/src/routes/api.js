const express = require('express');
const router = express.Router();
const storage = require('../models/storage');
const { runRecommendationEngine } = require('../engine/xaiEngine');
const { getDbStatus, connectDB } = require('../config/db');

// Connect to dynamic MongoDB / Atlas URI
router.post('/connect', async (req, res) => {
  try {
    const { uri } = req.body;
    if (!uri || !uri.trim()) {
      return res.status(400).json({ error: 'Please provide a valid MongoDB connection string (URI).' });
    }

    const connResult = await connectDB(uri.trim());
    if (!connResult.isConnected) {
      return res.status(400).json({
        success: false,
        error: connResult.error || 'Failed to connect to MongoDB with the provided URI. Please verify your credentials and network IP access.'
      });
    }

    // Auto seed database to ensure collections exist
    await storage.seedAll();

    res.json({
      success: true,
      message: 'Successfully connected and synchronized database.',
      database: getDbStatus()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Healthcheck & System Status
router.get('/health', async (req, res) => {
  try {
    const dbStatus = getDbStatus();
    const commodities = await storage.getCommodities();
    const materials = await storage.getMaterials();
    const rules = await storage.getRules();

    res.json({
      status: 'online',
      service: 'AI Food Packaging Recommender API',
      database: dbStatus,
      stats: {
        commoditiesCount: commodities.length,
        materialsCount: materials.length,
        rulesCount: rules.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Commodities
router.get('/commodities', async (req, res) => {
  try {
    const list = await storage.getCommodities();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/commodities/:id', async (req, res) => {
  try {
    const item = await storage.getCommodityById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Commodity not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/commodities', async (req, res) => {
  try {
    const created = await storage.createCommodity(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Packaging Materials
router.get('/materials', async (req, res) => {
  try {
    const list = await storage.getMaterials();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/materials/:id', async (req, res) => {
  try {
    const item = await storage.getMaterialById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Material not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/materials', async (req, res) => {
  try {
    const created = await storage.createMaterial(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Rules Catalog
router.get('/rules', async (req, res) => {
  try {
    const list = await storage.getRules();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Recommendation Inference Engine
router.post('/recommend', async (req, res) => {
  try {
    const { commodityId, customCommodity, userPriorities } = req.body;

    let targetCommodity = null;
    if (customCommodity) {
      targetCommodity = customCommodity;
    } else if (commodityId) {
      targetCommodity = await storage.getCommodityById(commodityId);
      if (!targetCommodity) {
        return res.status(404).json({ error: `Commodity '${commodityId}' not found.` });
      }
    } else {
      return res.status(400).json({ error: 'Please provide either commodityId or customCommodity.' });
    }

    const materials = await storage.getMaterials();
    const rules = await storage.getRules();

    const recommendationOutput = runRecommendationEngine(
      targetCommodity,
      materials,
      rules,
      userPriorities
    );

    // Save to recommendation history
    try {
      await storage.saveRecommendation({
        commodityName: targetCommodity.name || 'Custom Food Commodity',
        commodityCategory: targetCommodity.category || 'Custom',
        commodityInputs: targetCommodity,
        userPriorities: userPriorities || {},
        topRecommendations: recommendationOutput.topRecommendations.map(r => ({
          materialId: r.materialId,
          materialName: r.materialName,
          materialCode: r.materialCode,
          overallScore: r.overallScore,
          rank: r.rank,
          barrierScore: r.scores.preservation,
          sustainabilityScore: r.scores.sustainability,
          costScore: r.scores.costEfficiency,
          preservationScore: r.scores.preservation,
          predictedShelfLifeDays: r.predictedShelfLifeDays,
          whyRecommended: r.whyRecommended,
          keyTradeoffs: r.keyTradeoffs,
          activePackagingAddons: r.activePackagingAddons
        })),
        rulesFiredCount: recommendationOutput.topRecommendations[0]?.ruleTrace?.length || 0
      });
    } catch (saveErr) {
      console.warn('History save non-fatal error:', saveErr.message);
    }

    res.json(recommendationOutput);
  } catch (err) {
    console.error('Recommendation engine error:', err);
    res.status(500).json({ error: err.message });
  }
});

// History
router.get('/history', async (req, res) => {
  try {
    const history = await storage.getHistory(30);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed / Reset Database
router.post('/seed', async (req, res) => {
  try {
    const result = await storage.seedAll();
    res.json({
      message: 'Database seeded successfully',
      target: result.target
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

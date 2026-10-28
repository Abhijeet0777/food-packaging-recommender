/**
 * Rule-Based Explainable AI (XAI) Engine for Food Packaging Materials
 * Combines forward-chaining rule activation, multi-attribute barrier scoring,
 * hard disqualification filters, and natural language audit traces.
 */

function evaluateRuleCondition(conditionStr, context) {
  // Safe condition evaluator for rule engine
  try {
    const { commodity, material } = context;
    // Helper accessors
    const fatContent = commodity.fatContent || 0;
    const moistureContent = commodity.moistureContent || 0;
    const waterActivity = commodity.waterActivity || 0.5;
    const fatType = commodity.fatType || 'none';
    const respirationRate = commodity.respirationRate || 'none';
    const lightSensitivity = commodity.lightSensitivity || 'low';
    const storageTempC = commodity.storageTempC !== undefined ? commodity.storageTempC : 20;
    const requiresLightBlock = !!commodity.requiresLightBlock;
    const requiresBreathingPermeability = !!commodity.requiresBreathingPermeability;
    const requiresDegassingValve = !!commodity.requiresDegassingValve;
    const primaryFailureMode = commodity.primaryFailureMode || '';

    // Material properties
    const otr = material.otr !== undefined ? material.otr : 100;
    const wvtr = material.wvtr !== undefined ? material.wvtr : 10;
    const greaseResistance = material.greaseResistance || 5;
    const uvBarrierScore = material.uvBarrierScore || 5;
    const coldCrackTempC = material.coldCrackTempC !== undefined ? material.coldCrackTempC : 0;
    const isRecyclable = !!material.isRecyclable;
    const isBiodegradable = !!material.isBiodegradable;

    // Evaluate standard conditions
    if (conditionStr.includes("respirationRate IN ['high', 'very_high']")) {
      return respirationRate === 'high' || respirationRate === 'very_high';
    }
    if (conditionStr.includes("fatContent >= 10 AND fatType IN ['polyunsaturated', 'unsaturated']")) {
      return fatContent >= 10 && (fatType === 'polyunsaturated' || fatType === 'unsaturated');
    }
    if (conditionStr.includes("lightSensitivity IN ['high', 'very_high'] OR requiresLightBlock === true")) {
      return lightSensitivity === 'high' || lightSensitivity === 'very_high' || requiresLightBlock;
    }
    if (conditionStr.includes("moistureContent <= 5 AND waterActivity <= 0.3")) {
      return moistureContent <= 5 && waterActivity <= 0.3;
    }
    if (conditionStr.includes("storageTempC <= -15")) {
      return storageTempC <= -15;
    }
    if (conditionStr.includes("fatContent >= 15")) {
      return fatContent >= 15;
    }
    if (conditionStr.includes("primaryFailureMode === 'aroma_loss' OR requiresDegassingValve === true")) {
      return primaryFailureMode === 'aroma_loss' || requiresDegassingValve;
    }
    if (conditionStr.includes("isRecyclable === true OR isBiodegradable === true")) {
      return isRecyclable || isBiodegradable;
    }
    if (conditionStr.includes("nitrogenFlushingRecommended === true")) {
      return !!commodity.nitrogenFlushingRecommended || !!commodity.recommendedAtmosphere;
    }

    return false;
  } catch (err) {
    console.error('Error evaluating rule condition:', err);
    return false;
  }
}

/**
 * Calculates barrier sub-scores (0 - 100) based on food science target tolerances
 */
function calculateBarrierSubscores(commodity, material) {
  // 1. Oxygen Barrier Score (OTR)
  let otrScore = 50;
  const isFatty = (commodity.fatContent || 0) >= 10;
  const isMicrobialSpoilage = commodity.primaryFailureMode === 'microbial';
  const targetOTR = commodity.maxOTRRequired || (isFatty ? 5.0 : (isMicrobialSpoilage ? 20.0 : 50.0));

  if (commodity.respirationRate === 'high' || commodity.respirationRate === 'very_high') {
    // Living produce requires HIGH breathability!
    if (material.otr >= 1000) {
      otrScore = 95; // Perfectly breathable
    } else if (material.otr >= 300) {
      otrScore = 65;
    } else {
      otrScore = 10; // Extreme penalty: suffocation hazard!
    }
  } else {
    // Normal food requiring gas barrier
    if (material.otr <= targetOTR) {
      otrScore = 98;
    } else if (material.otr <= targetOTR * 2) {
      otrScore = 80;
    } else if (material.otr <= targetOTR * 5) {
      otrScore = 55;
    } else if (material.otr <= targetOTR * 10) {
      otrScore = 30;
    } else {
      otrScore = 15;
    }
  }

  // 2. Moisture Barrier Score (WVTR)
  let wvtrScore = 50;
  const targetWVTR = commodity.maxWVTRRequired || (commodity.waterActivity <= 0.3 ? 1.5 : 15.0);

  if (commodity.respirationRate === 'high' || commodity.respirationRate === 'very_high') {
    // For produce, moderate transmission prevents condensation
    if (material.wvtr >= 20.0) {
      wvtrScore = 90;
    } else {
      wvtrScore = 60; // Condensation risk
    }
  } else {
    if (material.wvtr <= targetWVTR) {
      wvtrScore = 98;
    } else if (material.wvtr <= targetWVTR * 2) {
      wvtrScore = 82;
    } else if (material.wvtr <= targetWVTR * 4) {
      wvtrScore = 60;
    } else {
      wvtrScore = 25;
    }
  }

  // 3. UV / Light Protection Score
  let uvScore = 70;
  const needsLightBlock = commodity.requiresLightBlock || ['high', 'very_high'].includes(commodity.lightSensitivity);
  if (needsLightBlock) {
    uvScore = Math.min(100, (material.uvBarrierScore / 10) * 100);
  } else {
    // If not light-sensitive, transparent packaging is actually desirable for consumer display!
    uvScore = 85;
  }

  // 4. Grease Resistance Score
  let greaseScore = 80;
  const reqGrease = commodity.minGreaseResistance || (commodity.fatContent >= 15 ? 9 : 3);
  if (material.greaseResistance >= reqGrease) {
    greaseScore = 95;
  } else {
    const diff = reqGrease - material.greaseResistance;
    greaseScore = Math.max(10, 80 - diff * 20);
  }

  // 5. Thermal & Cold Crack Score
  let thermalScore = 85;
  const storageTemp = commodity.storageTempC !== undefined ? commodity.storageTempC : 20;
  if (storageTemp <= -15) {
    if (material.coldCrackTempC <= -25) {
      thermalScore = 98;
    } else if (material.coldCrackTempC <= -15) {
      thermalScore = 75;
    } else {
      thermalScore = 20; // Critical failure risk in freezer
    }
  }

  // 6. Sustainability / Eco Score (0-100)
  const ecoScore = material.sustainabilityScore || 50;

  // 7. Economic Cost Score (0-100, where CostIndex 1 = 100, 5 = 20)
  const costScore = Math.max(20, 100 - (material.costIndex - 1) * 20);

  return {
    otrScore,
    wvtrScore,
    uvScore,
    greaseScore,
    thermalScore,
    ecoScore,
    costScore
  };
}

/**
 * Main Explainable AI Recommendation Runner
 */
function runRecommendationEngine(commodity, materials, rules, userPriorities = {}) {
  // Normalize user priorities (default balanced weights)
  const weights = {
    shelfLife: userPriorities.shelfLife !== undefined ? userPriorities.shelfLife : 40,
    sustainability: userPriorities.sustainability !== undefined ? userPriorities.sustainability : 25,
    cost: userPriorities.cost !== undefined ? userPriorities.cost : 20,
    physicalProtection: userPriorities.physicalProtection !== undefined ? userPriorities.physicalProtection : 15
  };

  const totalWeight = weights.shelfLife + weights.sustainability + weights.cost + weights.physicalProtection || 100;
  const wShelf = weights.shelfLife / totalWeight;
  const wEco = weights.sustainability / totalWeight;
  const wCost = weights.cost / totalWeight;
  const wPhysical = weights.physicalProtection / totalWeight;

  const results = [];
  const globalAuditTrail = [];

  for (const material of materials) {
    const ruleTrace = [];
    const whyRecommended = [];
    const keyTradeoffs = [];
    const activePackagingAddons = [];
    let isDisqualified = false;
    let disqualificationReason = null;
    let ruleBonusPenalty = 0;

    // Context for rule evaluator
    const context = { commodity, material };

    // --- PHASE 1: FORWARD-CHAINING RULE INFERENCE ---
    for (const rule of rules) {
      if (rule.isActive === false) continue;

      const triggered = evaluateRuleCondition(rule.triggerCondition, context);

      if (triggered) {
        let ruleEffect = 'EVALUATED';
        let delta = 0;

        // Execute rule action
        if (rule.id === 'RULE_LIVING_PRODUCE_SUFFOCATION') {
          // If living produce and material has low permeability
          if (material.otr < 100) {
            isDisqualified = true;
            disqualificationReason = `Severe suffocation hazard: Material OTR (${material.otr} cc) is hermetic. Fresh living commodities will undergo anaerobic alcoholic fermentation and spoil rapidly.`;
            ruleEffect = 'DISQUALIFIED';
            delta = -90;
          } else if (material.id === 'micro-perforated-bopp') {
            ruleEffect = 'OPTIMAL_MATCH';
            delta = +25;
            whyRecommended.push(`Engineered micro-perforations prevent produce suffocation and condensation fog.`);
          }
        } else if (rule.id === 'RULE_LIPID_OXIDATION_BARRIER') {
          if (material.otr <= 2.0) {
            delta = +15;
            ruleEffect = 'STRONG_BARRIER_BOOST';
            whyRecommended.push(`Exceptional oxygen barrier (${material.otr} cc/m²/day) stops polyunsaturated fat rancidity.`);
          } else if (material.otr > 50.0) {
            delta = -25;
            ruleEffect = 'INSUFFICIENT_O2_BARRIER';
            keyTradeoffs.push(`Elevated oxygen transmission (${material.otr} cc) accelerates rancid oil off-flavors.`);
          }
        } else if (rule.id === 'RULE_PHOTO_OXIDATION_LIGHT_BLOCK') {
          if (material.uvBarrierScore >= 9) {
            delta = +15;
            ruleEffect = 'PHOTO_SHIELD_MATCH';
            whyRecommended.push(`Full opacity / UV absorption (${material.uvBarrierScore}/10) protects against photo-oxidative off-flavors.`);
          } else if (material.uvBarrierScore <= 5) {
            delta = -20;
            ruleEffect = 'UV_TRANSMISSION_RISK';
            keyTradeoffs.push(`High light transparency allows UV-induced flavor degradation.`);
          }
        } else if (rule.id === 'RULE_CRISPNESS_WVTR_LIMIT') {
          if (material.wvtr <= 1.0) {
            delta = +15;
            ruleEffect = 'CRISPNESS_PRESERVED';
            whyRecommended.push(`Ultra-low WVTR (${material.wvtr} g/m²/day) maintains structural glassy crispness.`);
          } else if (material.wvtr >= 5.0) {
            delta = -25;
            ruleEffect = 'SOGGY_TEXTURE_PENALTY';
            keyTradeoffs.push(`Higher moisture permeance risks premature loss of crispness.`);
          }
        } else if (rule.id === 'RULE_SUB_ZERO_COLD_CRACK') {
          if (material.coldCrackTempC > -15) {
            isDisqualified = true;
            disqualificationReason = `Cold crack failure: Material embrittles at ${material.coldCrackTempC}°C, failing in -18°C deep freeze.`;
            ruleEffect = 'COLD_BRITTLE_DISQUALIFIED';
            delta = -80;
          } else {
            delta = +10;
            whyRecommended.push(`Cryogenic crack resistance down to ${material.coldCrackTempC}°C sustains freezer stability.`);
          }
        } else if (rule.id === 'RULE_HIGH_GREASE_RESISTANCE') {
          if (material.greaseResistance < 8) {
            delta = -20;
            keyTradeoffs.push(`Moderate grease resistance (Kit ${material.greaseResistance}) risks oil seepage or delamination.`);
          } else {
            delta = +10;
          }
        } else if (rule.id === 'RULE_AROMA_SCALPING_AND_GAS_VALVE') {
          activePackagingAddons.push('One-Way Degassing Valve (Permits CO2 venting while locking out oxygen)');
          whyRecommended.push('Integrates one-way aroma-preserving degassing valve for safe headspace venting.');
        } else if (rule.id === 'RULE_ACTIVE_MAP_GAS_FLUSH') {
          if (commodity.recommendedAtmosphere) {
            const atm = commodity.recommendedAtmosphere;
            activePackagingAddons.push(`Modified Atmosphere Packaging (MAP): ${atm.o2}% O2 / ${atm.co2}% CO2 / ${atm.n2}% N2`);
          } else if (commodity.nitrogenFlushingRecommended) {
            activePackagingAddons.push('Nitrogen (N2) Gas Headspace Flushing (<1% residual O2)');
          }
        } else if (rule.id === 'RULE_CIRCULAR_SUSTAINABILITY_BOOST') {
          if (material.isRecyclable || material.isBiodegradable) {
            delta = +15;
            whyRecommended.push(
              material.isBiodegradable
                ? `Certified compostable (${material.compostability}) minimizing long-term persistent plastic waste.`
                : `Circular mono-material recyclable design (${material.recyclabilityCode}).`
            );
          }
        }

        ruleBonusPenalty += delta;
        ruleTrace.push({
          ruleId: rule.id,
          ruleName: rule.name,
          category: rule.category,
          effect: ruleEffect,
          scoreDelta: delta,
          explanation: rule.scientificExplanation
        });
      }
    }

    // --- PHASE 2: SUB-METRICS & MULTI-OBJECTIVE WEIGHTING ---
    const sub = calculateBarrierSubscores(commodity, material);

    // Combined Preservation score (OTR, WVTR, UV, Grease, Thermal)
    const preservationScore = Math.round(
      (sub.otrScore * 0.35) +
      (sub.wvtrScore * 0.35) +
      (sub.uvScore * 0.15) +
      (sub.greaseScore * 0.08) +
      (sub.thermalScore * 0.07)
    );

    // Raw weighted score before rule delta
    let rawScore = (
      (preservationScore * wShelf) +
      (sub.ecoScore * wEco) +
      (sub.costScore * wCost) +
      (sub.greaseScore * wPhysical)
    );

    // Apply rule bonus / penalty
    let overallScore = Math.round(rawScore + (ruleBonusPenalty * 0.35));

    // Form Factor / Practical Ergonomics Adjustment
    // For snack foods, dry powders, and bakery, heavy rigid containers (Glass, Tin) are often impractical
    // unless explicitly required (e.g., liquids, canning, olive oil).
    if (!commodity.requiresRigidContainer && (material.category === 'Traditional Rigid Container')) {
      if (['Snack Foods', 'Bakery & Confectionery', 'Fresh Produce'].includes(commodity.category)) {
        overallScore -= 12;
        keyTradeoffs.push(`Rigid heavy packaging format represents excessive unit weight and transport cost for lightweight ${commodity.category.toLowerCase()}.`);
      }
    }

    // Clamp score
    if (isDisqualified) {
      overallScore = Math.min(18, overallScore);
    } else {
      overallScore = Math.max(20, Math.min(99, overallScore));
    }

    // Identify standard trade-offs if not already mentioned
    if (material.costIndex >= 4 && !keyTradeoffs.some(t => t.includes('cost'))) {
      keyTradeoffs.push(`Higher raw packaging material cost (Cost Index ${material.costIndex}/5).`);
    }
    if (!material.isRecyclable && !material.isBiodegradable && !keyTradeoffs.some(t => t.includes('recycl'))) {
      keyTradeoffs.push(`Multilayer structure cannot be recycled in residential municipal curbside streams.`);
    }
    if (material.wvtr > 10 && commodity.waterActivity <= 0.4 && !keyTradeoffs.some(t => t.includes('Moisture'))) {
      keyTradeoffs.push(`Elevated moisture permeability (WVTR ${material.wvtr} g/m²) may shorten ambient shelf life.`);
    }

    // Predicted shelf-life extension multiplier
    let shelfLifeMultiplier = 1.0;
    if (overallScore >= 85) shelfLifeMultiplier = 2.5;
    else if (overallScore >= 70) shelfLifeMultiplier = 1.8;
    else if (overallScore >= 50) shelfLifeMultiplier = 1.2;
    else shelfLifeMultiplier = 0.5;

    const baselineDays = commodity.targetShelfLifeDays || 30;
    const predictedShelfLifeDays = Math.round(baselineDays * (overallScore / 80));

    results.push({
      materialId: material.id,
      materialName: material.name,
      materialCode: material.code,
      materialCategory: material.category,
      overallScore,
      isDisqualified,
      disqualificationReason,
      scores: {
        overall: overallScore,
        preservation: preservationScore,
        sustainability: sub.ecoScore,
        costEfficiency: sub.costScore,
        moistureBarrier: sub.wvtrScore,
        oxygenBarrier: sub.otrScore,
        uvShield: sub.uvScore,
        greaseResistance: sub.greaseScore
      },
      materialSpecs: {
        wvtr: material.wvtr,
        otr: material.otr,
        uvBarrierScore: material.uvBarrierScore,
        greaseResistance: material.greaseResistance,
        recyclabilityCode: material.recyclabilityCode,
        isRecyclable: material.isRecyclable,
        isBiodegradable: material.isBiodegradable,
        compostability: material.compostability,
        costIndex: material.costIndex
      },
      predictedShelfLifeDays,
      whyRecommended: whyRecommended.length ? whyRecommended : [
        `Good baseline barrier properties match the food commodity specifications.`
      ],
      keyTradeoffs: keyTradeoffs.length ? keyTradeoffs : [
        `Standard performance profile within expected operational thresholds.`
      ],
      activePackagingAddons: [...new Set(activePackagingAddons)],
      ruleTrace
    });
  }

  // Sort by overall score descending (non-disqualified first)
  results.sort((a, b) => {
    if (a.isDisqualified !== b.isDisqualified) {
      return a.isDisqualified ? 1 : -1;
    }
    return b.overallScore - a.overallScore;
  });

  // Assign ranks
  results.forEach((res, idx) => {
    res.rank = idx + 1;
  });

  return {
    commodity,
    userPriorities: weights,
    topRecommendations: results.slice(0, 5),
    allEvaluations: results,
    totalEvaluated: results.length,
    disqualifiedCount: results.filter(r => r.isDisqualified).length,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  runRecommendationEngine,
  calculateBarrierSubscores,
  evaluateRuleCondition
};

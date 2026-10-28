# 🥑 PackAI: Intelligent Food Packaging Material Recommendation System

> **A Full-Stack Explainable AI (XAI) Decision Support System for Food Commodities using Forward-Chaining Packaging Science Rules & MongoDB Atlas.**

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8.svg)](https://tailwindcss.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas_Cloud-47a248.svg)](https://www.mongodb.com/cloud/atlas)
[![AI Approach](https://img.shields.io/badge/AI_Approach-Rule--Based_XAI-purple.svg)](#explainable-ai-xai-architecture)

---

## 📋 Table of Contents
1. [Overview & Scientific Basis](#overview--scientific-basis)
2. [Key Capabilities](#key-capabilities)
3. [System Architecture](#system-architecture)
4. [Step-by-Step MongoDB Atlas Setup Guide](#step-by-step-mongodb-atlas-setup-guide)
5. [Quick Start & Running Instructions](#quick-start--running-instructions)
6. [Explainable AI (XAI) Engine Walkthrough](#explainable-ai-xai-engine-walkthrough)
7. [API Endpoints Reference](#api-endpoints-reference)
8. [Directory Structure](#directory-structure)

---

## 🔬 Overview & Scientific Basis

Selecting food packaging materials is a multi-attribute bio-chemical engineering challenge. Food regulatory authorities (FDA, EFSA, FSSAI) require **auditable, fully explainable recommendations** rather than opaque "black-box" predictions.

**PackAI** combines:
- **Biochemical food vulnerability metrics**: Water activity ($a_w$), moisture sorption, respiration rate ($R_{CO_2}$), lipid oxidation kinetics, photo-degradation, and enzymatic browning.
- **Packaging material barrier metrics (ASTM Standards)**:
  - **WVTR** (Water Vapor Transmission Rate in $g/m^2/day$) — ASTM F1249
  - **OTR** (Oxygen Transmission Rate in $cc/m^2/day$) — ASTM D3985
  - **UV / Light Shielding** (Wavelengths 300–450 nm)
  - **Kit Grease Resistance** (TAPPI T559)
  - **Cold-Crack Embrittlement Temperature** ($T_g$)
  - **Circular Sustainability & PPWR Compliance**: Curbside repulpability, mono-material PE/PP recycling, and certified industrial/home composting (EN 13432 / ASTM D6400).
- **Rule-Based Explainable AI (XAI)**: Forward-chaining expert rules that evaluate, disqualify, score, and output a transparent audit trace detailing *why* each material was recommended or rejected.

---

## ✨ Key Capabilities

1. **Interactive Recommendation Wizard**:
   - Choose from pre-configured foods spanning all major categories: *Potato Chips, Fresh Strawberries, Whole Roasted Coffee Beans, Fresh Atlantic Salmon, Artisan Sourdough Bread, EVOO, Infant Formula Powder, Frozen Meat Dumplings, Dark Chocolate, Cheddar Cheese, etc.*
   - Or design **Custom Food Commodities** with interactive sliders for Moisture %, Aw, Fat Profile, Respiration Rate, Storage Temp, and Light Sensitivity.
2. **Multi-Objective Priority Weighting**:
   - Sliders to customize decision bias: **Shelf Life Extension**, **Circular Eco / Recyclability**, **Cost Efficiency**, and **Mechanical / Seal Integrity**.
3. **Explainable AI (XAI) Audit Dashboard**:
   - **Rank #1 Top Winner** with Compatibility Score (0–100%).
   - **"Why Recommended"** bulleted explanation linking specific barrier metrics to the food's degradation mechanism.
   - **Engineering Trade-offs & Caveats** (honest assessment of material limitations like cost, curbside recyclability, or microwave compatibility).
   - **Active & Intelligent Packaging Add-ons**: MAP (Modified Atmosphere Packaging gas ratios: $O_2\% / CO_2\% / N_2\%$), one-way degassing aroma valves, silica desiccants, or oxygen scavengers.
   - **Barrier Comparison Radar Chart**: Interactive 6-axis radar visualizer comparing candidates.
   - **Shelf-Life Prediction**: Projected shelf-life extension in days vs. baseline target.
   - **Disqualified Materials Log**: Explicit scientific rejection reasons (e.g. anaerobic suffocation hazard for fresh produce, or cryogenic embrittlement in sub-zero freezers).
4. **Knowledge Base Catalogs**:
   - Searchable **Packaging Materials Database** with barrier specs.
   - Searchable **Food Commodities Database** with biochemical properties.
   - Interactive **AI Rule Explorer** showing IF-THEN triggers, priorities, and chemical rationale.
5. **MongoDB Atlas Cloud Database with Standalone Fallback**:
   - Seamlessly syncs to MongoDB Atlas using standard Mongoose connection.
   - Built-in high-performance in-memory fallback mode so the application runs 100% interactively out of the box even before configuring cloud credentials.

---

## 🏗️ System Architecture

```
                    ┌──────────────────────────────────────────┐
                    │               PackAI React UI            │
                    │   (Vite + React 18 + Tailwind + Charts)  │
                    └─────────────────────┬────────────────────┘
                                          │ HTTP / REST (/api)
                                          ▼
                    ┌──────────────────────────────────────────┐
                    │         Express.js Backend Server        │
                    │                 (Port 5001)              │
                    └───────┬──────────────────────────┬───────┘
                            │                          │
           ┌────────────────▼───────────────┐          │
           │  Rule-Based XAI Engine         │          │
           │  - Hard Disqualification Rules │          │
           │  - Barrier Tolerance Scoring   │          │
           │  - Multi-Criteria MCDA Weights │          │
           │  - Natural Language Explainer  │          │
           └────────────────────────────────┘          │
                                                       ▼
                                      ┌────────────────────────────────┐
                                      │        Data Storage Layer      │
                                      │   (MongoDB Atlas / Mongoose)   │
                                      │   * Auto In-Memory Fallback    │
                                      └────────────────────────────────┘
```

---

## ☁️ Step-by-Step MongoDB Atlas Setup Guide

Follow these simple steps to connect your free MongoDB Atlas database:

### Step 1: Create a Free MongoDB Atlas Account & Cluster
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Click **Build a Database** and select the **M0 Shared (Free Forever)** tier.
3. Choose your preferred cloud provider and closest region (e.g., AWS / Mumbai, Singapore, N. Virginia).
4. Click **Create Deployment**.

### Step 2: Configure Network Security (IP Whitelist)
1. In the Atlas dashboard sidebar, navigate to **Security** → **Network Access**.
2. Click **Add IP Address**.
3. Click **Allow Access from Anywhere** (`0.0.0.0/0`) or select **Add Current IP Address**.
4. Click **Confirm**.

### Step 3: Create a Database User
1. In the sidebar, navigate to **Security** → **Database Access**.
2. Click **Add New Database User**.
3. Choose **Password** authentication:
   - Username: `food_admin` (or your choice)
   - Password: `yourSecurePassword123`
4. Set User Privileges to **Read and write to any database**.
5. Click **Add User**.

### Step 4: Retrieve Your Connection URI
1. Return to **Database** → click the **Connect** button on your cluster.
2. Select **Drivers** (Node.js).
3. Copy the connection string. It will look like:
   ```text
   mongodb+srv://food_admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 5: Configure the Project
1. Open the file `backend/.env` in your project.
2. Uncomment and paste your Atlas connection URI, replacing `<password>` with your database password:
   ```env
   PORT=5001
   MONGODB_URI=mongodb+srv://food_admin:yourSecurePassword123@cluster0.abcde.mongodb.net/food_packaging_db?retryWrites=true&w=majority
   ```
3. Save the file.

### Step 6: Seed Default Data to MongoDB Atlas
Run the seed script from the project root:
```bash
npm run seed
```
You will see:
```text
✅ MongoDB Atlas Connected: cluster0-shard-00-00.mongodb.net (DB: food_packaging_db)
Seeding data to MongoDB Atlas...
✅ MongoDB Atlas seeded successfully.
```
*Note: If `MONGODB_URI` is not set, the app will smoothly run in in-memory mode without crashing!*

---

## 🚀 Quick Start & Running Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0 or higher
- npm v9.0 or higher

### 1. Installation
Clone or navigate to the project directory:
```bash
cd /Users/abhijeetjha/.gemini/antigravity/scratch/food-packaging-recommender
```
*(Dependencies for both frontend and backend are already pre-installed.)*

### 2. Start Both Backend & Frontend
Run the all-in-one dev command:
```bash
npm run dev
```
This boots:
- 🚀 **Backend API**: `http://localhost:5001`
- 💻 **Frontend Web App**: `http://localhost:3000`

### 3. Alternative: Run Individually in Separate Terminals
**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Open `http://localhost:3000` in your web browser.

---

## 🧠 Explainable AI (XAI) Engine Walkthrough

The recommendation engine executes a 3-phase forward-chaining inference process:

### Phase 1: Hard Disqualification Constraints
Rules with priority $\ge 90$ filter out dangerous or physically incompatible combinations:
- **`RULE_LIVING_PRODUCE_SUFFOCATION`**: Fresh living produce (e.g. strawberries, spinach) undergoes active respiration. Hermetic zero-barrier films ($OTR < 100$) suffocate living tissues and cause anaerobic fermentation, acetaldehyde rot, and ballooning. Disqualifies foil/EVOH and boosts **Laser Micro-Perforated BOPP**.
- **`RULE_SUB_ZERO_COLD_CRACK`**: Deep frozen foods ($-18^\circ C$) embrittle ordinary plastics below their glass transition temperature ($T_g$). Disqualifies materials with cold-crack $>-15^\circ C$.
- **`RULE_LIPID_OXIDATION_BARRIER`**: Foods with $\ge 10\%$ polyunsaturated fats require strict $OTR \le 15\,cc/m^2/day$.

### Phase 2: Multi-Criteria Barrier Matching
Calculates 7 calibrated subscores (0–100%):
1. **Moisture Barrier Score (WVTR)**: Measured against water activity ($a_w$) and critical crispness moisture thresholds.
2. **Oxygen Barrier Score (OTR)**: Evaluated against lipid rancidity and aerobic microbial growth.
3. **UV / Light Shield Score**: Evaluated against photo-oxidative degradation of riboflavin and chlorophyll.
4. **Grease Resistance Score**: Evaluated against TAPPI Kit ratings.
5. **Thermal Stability Score**: Match against freezing, ambient, or microwave/retort temperatures.
6. **Circular Sustainability Score**: Based on mono-material recyclability (#1 PET, #2 HDPE, #5 PP) and certified compostability (PLA, Cellulose).
7. **Cost Efficiency Score**: Inverse of raw material cost index ($1=$ to $5=\$\$\$\$\$).

### Phase 3: Explainability Generator
Generates:
- **Why Recommended**: Transparent natural language statements explaining which chemical vulnerability is addressed.
- **Trade-offs**: Highlights engineering compromises (e.g., non-recyclable metallized foil, higher unit cost, or lack of microwave suitability).
- **Active Add-ons**: Recommends nitrogen flushing, MAP gas mixture ($O_2/CO_2/N_2$), or one-way aroma degassing valves.

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description | Sample Payload / Notes |
|---|---|---|---|
| `GET` | `/api/health` | System and MongoDB Atlas status | Returns connection status, mode, and item counts |
| `GET` | `/api/commodities` | List all 12+ food commodities | Full biochemical profiles |
| `GET` | `/api/commodities/:id` | Single commodity details | e.g. `/api/commodities/potato-chips` |
| `POST` | `/api/commodities` | Create custom commodity | `{ name, category, moistureContent, ... }` |
| `GET` | `/api/materials` | List all 12+ packaging materials | Barrier values (WVTR, OTR, UV, Grease, Cost) |
| `GET` | `/api/materials/:id` | Single material details | e.g. `/api/materials/met-pet-pe` |
| `GET` | `/api/rules` | List all forward-chaining rules | Conditions, priorities, and explanations |
| `POST` | `/api/recommend` | **Run Explainable AI Recommender** | See payload below |
| `GET` | `/api/history` | Previous recommendation logs | Returns last 30 runs |
| `POST` | `/api/seed` | Seed / Reset database | Seeds default catalog to Atlas or memory |

### Sample Recommendation Request:
```json
POST /api/recommend
Content-Type: application/json

{
  "commodityId": "potato-chips",
  "userPriorities": {
    "shelfLife": 40,
    "sustainability": 25,
    "cost": 25,
    "physicalProtection": 10
  }
}
```

---

## 📁 Directory Structure

```text
food-packaging-recommender/
├── package.json              # Root package with multi-process runner scripts
├── run-all.js                # Cross-platform concurrent runner
├── README.md                 # Complete documentation & Atlas setup guide
├── backend/
│   ├── package.json          # Express, Mongoose, Dotenv, Cors
│   ├── .env.example          # Environment variables template
│   ├── .env                  # Active configuration
│   ├── seed.js               # Standalone MongoDB Atlas seeder
│   └── src/
│       ├── config/
│       │   └── db.js         # Atlas connection manager with memory fallback
│       ├── data/
│       │   └── seedData.js   # 12 commodities, 12 materials, 9 expert rules
│       ├── engine/
│       │   └── xaiEngine.js  # Forward-chaining rule engine & scoring logic
│       ├── models/
│       │   ├── Commodity.js  # Food commodity Mongoose schema
│       │   ├── Material.js   # Packaging material Mongoose schema
│       │   ├── Rule.js       # Expert rule Mongoose schema
│       │   ├── RecommendationHistory.js # Past recommendation schema
│       │   └── storage.js    # Seamless Atlas / in-memory storage manager
│       ├── routes/
│       │   └── api.js        # REST API endpoints
│       └── server.js         # Express app entry point
└── frontend/
    ├── package.json          # React 18, Vite, Tailwind, Chart.js, Lucide
    ├── vite.config.js        # Vite build config with backend proxy
    ├── tailwind.config.js    # Tailwind styling config
    ├── index.html            # Web application entry point
    └── src/
        ├── index.css         # Tailwind & custom typography
        ├── main.jsx          # React DOM root
        ├── App.jsx           # Main navigation & view controller
        ├── services/
        │   └── api.js        # REST API client
        └── components/
            ├── Navbar.jsx               # Header & Atlas status indicator
            ├── AtlasStatusModal.jsx     # Live Atlas guide & status modal
            ├── RecommendationWizard.jsx # Commodity selector & priority sliders
            ├── RecommendationResults.jsx# XAI Dashboard, why recommended & trade-offs
            ├── RadarMetricChart.jsx     # 6-axis Chart.js barrier visualizer
            ├── MaterialCatalog.jsx      # Searchable materials database
            ├── CommodityCatalog.jsx     # Searchable commodities database
            ├── RuleExplorer.jsx         # Interactive knowledge base rules viewer
            └── HistoryDrawer.jsx        # Recommendation history slide-over
```

---

## 📜 Food Packaging Standards Compliance
All barrier properties and rules adhere to:
- **ASTM F1249 / ISO 15106**: Water Vapor Transmission Rate by Modulated Infrared Sensor.
- **ASTM D3985**: Oxygen Gas Transmission Rate through Plastic Film using Coulometric Sensor.
- **TAPPI T559**: Grease Resistance Testing for Paper and Packaging Materials.
- **FDA 21 CFR §177**: Indirect Food Additives (Polymers & Food Contact Surfaces).
- **EU Regulation 10/2011**: Plastic Materials Intended to Come into Contact with Food.
- **EN 13432 / ASTM D6400**: Standards for Packaging Recoverable through Composting and Biodegradation.

# ECO-SAMUDRA: Green Fleet Intelligence & Maritime Sustainability Analytics

ECO-SAMUDRA is a professional, modern, interactive web application analyzing global maritime connectivity and World Bank environmental & energy indicators across 200+ countries from 1960 to 2024.

---

## 🏗️ Architecture Overview

```
eco_samudra/
├── data/
│   └── eco_samudra.csv                 # Cleaned dataset (8,733 records, 205 countries + 45 aggregates)
├── backend/
│   ├── main.py                         # FastAPI app entry point, CORS, routers
│   ├── data/
│   │   └── eco_samudra.csv             # Symlink or copy for backend ingestion
│   ├── analytics/
│   │   ├── __init__.py
│   │   ├── cleaner.py                  # Missing value handling, aggregate filtering, imputation
│   │   └── metrics.py                  # Aggregation, yearly statistics, KPI computations
│   └── services/
│       ├── __init__.py
│       ├── analytics_service.py        # Maritime & country analytics endpoints
│       ├── sustainability_service.py   # Green Maritime Index (GMI) scoring engine
│       └── prediction_service.py       # Extensible ML interface & schema contracts for future models
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── index.css                   # Maritime design system, theme variables, glassmorphism
│       ├── main.jsx
│       ├── App.jsx                     # Layout, navigation bar / sidebar, dark/light theme provider
│       ├── components/
│       │   ├── Navbar.jsx              # Brand header, navigation links, theme toggle, export trigger
│       │   ├── MetricCard.jsx          # KPI card with sparkline trend & delta
│       │   ├── FilterBar.jsx           # Global filters: Country, Year range, Grouping, Reset
│       │   ├── WorldMapRanking.jsx     # Geographic leader visualizer & interactive choropleth cards
│       │   ├── LoadingState.jsx        # Skeleton loaders & ocean wave micro-animations
│       │   └── ErrorState.jsx          # Resilient fallback UI
│       ├── pages/
│       │   ├── Dashboard.jsx           # Hero banner, 5 dynamic KPIs, 4 global maritime charts, filters
│       │   ├── MaritimeAnalytics.jsx   # LSCI deep-dive, container traffic leaders, quadrant analysis
│       │   ├── CountryExplorer.jsx     # Searchable country profile + side-by-side comparison mode
│       │   ├── Sustainability.jsx      # Green Maritime Index (GMI) dashboard, rankings, methodology modal
│       │   ├── ScenarioAnalysis.jsx    # Interactive What-If simulation slider engine with real-time scoring
│       │   └── Methodology.jsx         # Full transparency: data provenance, formulas, ML roadmap
│       ├── charts/
│       │   ├── TrendLineChart.jsx      # Historical multi-series line chart
│       │   ├── ComparisonBarChart.jsx  # Side-by-side country comparison bars
│       │   ├── MaritimeRadarChart.jsx  # 4-axis sustainability balance radar
│       │   └── ScatterQuadrantChart.jsx# Connectivity vs Container Volume matrix
│       ├── services/
│       │   └── api.js                  # Axios/Fetch client for FastAPI endpoints
│       ├── hooks/
│       │   ├── useTheme.js             # Dark / Light theme toggle with local storage persistence
│       │   └── useMaritimeData.js      # Cached data fetchers with filter state management
│       └── utils/
│           ├── formatters.js           # TEU formatters (M/k), percentage rounding, score badges
│           └── exportCsv.js            # Client-side filtered CSV export utility
└── README.md                           # Documentation, setup instructions, architecture breakdown
```

---

## ⚡ Quick Start & Setup Instructions

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & `npm`

### 2. Launch FastAPI Backend
```bash
cd backend
python -m pip install -r requirements.txt # Or install pandas fastapi uvicorn pydantic httpx
python main.py
```
Backend API server runs at `http://localhost:8000`. API documentation available at `http://localhost:8000/docs`.

### 3. Launch React Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend web application runs at `http://localhost:5173`.

---

## 📊 Green Maritime Index (GMI) Formulation

The Green Maritime Index (GMI) is formulated as:
$$\text{GMI} = 0.25 \times \text{Norm}(\text{LSCI}) + 0.25 \times \text{LogNorm}(\text{TEU}) + 0.30 \times (100 - \text{FossilFuel\%}) + 0.20 \times \text{Norm}(\text{EnergyIndep})$$

- **LSCI Connectivity (25%)**: Min-Max normalized Liner Shipping Connectivity Index.
- **Port Traffic Volume (25%)**: Log-scaled Min-Max normalized Container TEU volume.
- **Clean Energy Transition (30%)**: Inverted fossil fuel reliance ($100 - \text{FossilFuel\%}$).
- **Energy Independence (20%)**: Normalized net energy import dependency score.

---

## 🤖 Future Machine Learning Roadmap

Extensible abstract interface contracts in `backend/services/prediction_service.py`:
1. **AIS Vessel Carbon Footprint Model**: Real-time trajectory emission estimation.
2. **Voyage Hydrodynamic Optimization**: Weather-aware vessel routing.
3. **Port Congestion Prediction**: Berth waiting time and turnaround forecasting.

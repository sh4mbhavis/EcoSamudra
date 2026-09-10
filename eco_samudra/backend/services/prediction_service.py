from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException
from analytics.cleaner import load_and_clean_data
from services.sustainability_service import calculate_gmi_scores

router = APIRouter(prefix="/api", tags=["Prediction & Scenarios"])

df = load_and_clean_data()

class ScenarioInput(BaseModel):
    country_code: str = Field(..., example="IND", description="ISO-3 Country Code")
    lsci_change_pct: float = Field(0.0, example=15.0, description="Percentage change in LSCI (-100% to +200%)")
    teu_change_pct: float = Field(0.0, example=10.0, description="Percentage change in Container TEU (-100% to +200%)")
    fossil_fuel_change_pct: float = Field(0.0, example=-20.0, description="Percentage point change in Fossil Fuel % (-100 to +100)")
    energy_imports_change_pct: float = Field(0.0, example=-15.0, description="Percentage point change in Energy Imports % (-100 to +100)")

class MaritimeMLModelInterface(ABC):
    """
    Formal Abstract Base Class Interface contract for future Machine Learning model integration.
    Roadmap targets:
    1. AIS Vessel Trajectory & Fuel Consumption Predictor
    2. Maritime Carbon Emission Forecasting Model
    3. Port Congestion & Voyage Optimization Model
    """
    @abstractmethod
    def train(self, data: Any) -> Dict[str, float]:
        """Train model on historical maritime dataset."""
        pass

    @abstractmethod
    def predict(self, input_features: Dict[str, Any]) -> Dict[str, Any]:
        """Generate predictive inference given input features."""
        pass

    @abstractmethod
    def evaluate(self, test_data: Any) -> Dict[str, float]:
        """Compute evaluation metrics (RMSE, MAE, R²)."""
        pass

@router.post("/scenario")
def simulate_scenario(payload: ScenarioInput):
    code = payload.country_code.upper()
    country_df = df[df['country_code'] == code].sort_values('year')
    
    if country_df.empty:
        raise HTTPException(status_code=404, detail=f"Country '{code}' not found.")

    latest_row = country_df.iloc[-1].to_dict()
    latest_yr = int(latest_row['year'])

    # Baseline scoring across year cohort
    year_cohort = df[df['year'] == latest_yr].copy()
    baseline_cohort = calculate_gmi_scores(year_cohort)
    baseline_country = baseline_cohort[baseline_cohort['country_code'] == code].iloc[0]
    baseline_gmi = float(baseline_country['gmi_score'])

    # Apply scenario delta modifications
    new_lsci = max(0.0, float(latest_row['lsci']) * (1.0 + payload.lsci_change_pct / 100.0))
    new_teu = max(0.0, float(latest_row['container_port_traffic_teu']) * (1.0 + payload.teu_change_pct / 100.0))
    new_fossil = max(0.0, min(100.0, float(latest_row['fossil_fuel_pct']) + payload.fossil_fuel_change_pct))
    new_energy_imp = max(-100.0, min(100.0, float(latest_row['energy_imports_pct']) + payload.energy_imports_change_pct))

    # Calculate scenario GMI score
    scenario_cohort = year_cohort.copy()
    idx = scenario_cohort[scenario_cohort['country_code'] == code].index[0]
    scenario_cohort.loc[idx, 'lsci'] = new_lsci
    scenario_cohort.loc[idx, 'container_port_traffic_teu'] = new_teu
    scenario_cohort.loc[idx, 'fossil_fuel_pct'] = new_fossil
    scenario_cohort.loc[idx, 'energy_imports_pct'] = new_energy_imp

    scenario_scored = calculate_gmi_scores(scenario_cohort)
    scenario_country = scenario_scored[scenario_scored['country_code'] == code].iloc[0]
    scenario_gmi = float(scenario_country['gmi_score'])

    gmi_delta = round(scenario_gmi - baseline_gmi, 2)

    if gmi_delta > 1.0:
        status = "improved"
    elif gmi_delta < -1.0:
        status = "worsened"
    else:
        status = "stable"

    # Actionable Data-driven Recommendations
    recommendations = []
    if payload.fossil_fuel_change_pct < 0:
        recommendations.append("Decarbonization strategy aligns with IMO 2030 green shipping corridors and reduces port emission footprint.")
    elif payload.fossil_fuel_change_pct > 0:
        recommendations.append("Increasing fossil fuel reliance degrades clean energy score. Transition to shore-power / LNG bunkering recommended.")

    if payload.lsci_change_pct > 0:
        recommendations.append("Enhanced liner connectivity improves global supply chain integration and container throughput efficiency.")
    
    if payload.energy_imports_change_pct < 0:
        recommendations.append("Reducing net energy import dependency enhances national maritime energy independence resilience.")

    if not recommendations:
        recommendations.append("Current scenario parameters produce a balanced operational baseline with minimal net impact.")

    return {
        "country_code": code,
        "country_name": str(latest_row['country_name']),
        "year": latest_yr,
        "baseline_metrics": {
            "lsci": round(float(latest_row['lsci']), 2),
            "container_teu": round(float(latest_row['container_port_traffic_teu']), 0),
            "fossil_fuel_pct": round(float(latest_row['fossil_fuel_pct']), 2),
            "energy_imports_pct": round(float(latest_row['energy_imports_pct']), 2),
            "gmi_score": round(baseline_gmi, 2)
        },
        "simulated_metrics": {
            "lsci": round(new_lsci, 2),
            "container_teu": round(new_teu, 0),
            "fossil_fuel_pct": round(new_fossil, 2),
            "energy_imports_pct": round(new_energy_imp, 2),
            "gmi_score": round(scenario_gmi, 2)
        },
        "impact_analysis": {
            "gmi_score_delta": gmi_delta,
            "status": status,
            "recommendations": recommendations
        }
    }

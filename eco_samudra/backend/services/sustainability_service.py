import numpy as np
import pandas as pd
from fastapi import APIRouter, Query
from analytics.cleaner import load_and_clean_data

router = APIRouter(prefix="/api", tags=["Sustainability"])

df = load_and_clean_data()

def calculate_gmi_scores(df_subset: pd.DataFrame):
    """Calculates Green Maritime Index (GMI) scores for a dataset subset."""
    if df_subset.empty:
        return df_subset

    res = df_subset.copy()

    # 1. Normalized LSCI (0 - 100)
    lsci_max = res['lsci'].max() if res['lsci'].max() > 0 else 1.0
    lsci_min = res['lsci'].min()
    res['lsci_norm'] = np.where(lsci_max > lsci_min, (res['lsci'] - lsci_min) / (lsci_max - lsci_min) * 100.0, 50.0)

    # 2. Log-scaled Normalized TEU (0 - 100)
    log_teu = np.log1p(res['container_port_traffic_teu'].clip(lower=0))
    log_max = log_teu.max() if log_teu.max() > 0 else 1.0
    log_min = log_teu.min()
    res['teu_norm'] = np.where(log_max > log_min, (log_teu - log_min) / (log_max - log_min) * 100.0, 50.0)

    # 3. Clean Energy Transition Score (100 - fossil_fuel_pct)
    res['clean_energy_score'] = (100.0 - res['fossil_fuel_pct']).clip(lower=0.0, upper=100.0)

    # 4. Energy Independence Score (100 - net import dependency)
    res['energy_indep_score'] = (100.0 - res['energy_imports_pct'].clip(lower=0.0)).clip(lower=0.0, upper=100.0)

    # Weighted Composite GMI Score
    res['gmi_score'] = (
        0.25 * res['lsci_norm'] +
        0.25 * res['teu_norm'] +
        0.30 * res['clean_energy_score'] +
        0.20 * res['energy_indep_score']
    ).round(2)

    return res

@router.get("/sustainability")
def get_sustainability(
    year: int = Query(None, description="Target year"),
    include_aggregates: bool = Query(False, description="Include aggregates")
):
    filtered_df = df.copy()
    if not include_aggregates and 'is_aggregate' in filtered_df.columns:
        filtered_df = filtered_df[filtered_df['is_aggregate'] == False]

    target_yr = year if year is not None else filtered_df['year'].max()
    yr_df = filtered_df[filtered_df['year'] == target_yr]
    if yr_df.empty:
        yr_df = filtered_df.sort_values('year').groupby('country_code').last().reset_index()

    scored_df = calculate_gmi_scores(yr_df)
    scored_df = scored_df.sort_values('gmi_score', ascending=False).reset_index(drop=True)

    rankings = []
    for rank, (_, r) in enumerate(scored_df.iterrows(), 1):
        gmi = float(r['gmi_score'])
        if gmi >= 75:
            tier = "Leader (A+)"
        elif gmi >= 60:
            tier = "Advanced (A)"
        elif gmi >= 45:
            tier = "Moderate (B)"
        else:
            tier = "Developing (C)"

        rankings.append({
            "rank": rank,
            "country_code": str(r['country_code']),
            "country_name": str(r['country_name']),
            "gmi_score": gmi,
            "tier": tier,
            "components": {
                "lsci_score": round(float(r['lsci_norm']), 2),
                "teu_score": round(float(r['teu_norm']), 2),
                "clean_energy_score": round(float(r['clean_energy_score']), 2),
                "energy_indep_score": round(float(r['energy_indep_score']), 2)
            },
            "raw_indicators": {
                "lsci": round(float(r['lsci']), 2),
                "container_teu": round(float(r['container_port_traffic_teu']), 0),
                "fossil_fuel_pct": round(float(r['fossil_fuel_pct']), 2),
                "energy_imports_pct": round(float(r['energy_imports_pct']), 2)
            }
        })

    avg_gmi = round(float(scored_df['gmi_score'].mean()), 2) if not scored_df.empty else 50.0
    top_score = round(float(scored_df['gmi_score'].max()), 2) if not scored_df.empty else 0.0

    return {
        "year": int(target_yr),
        "total_countries_scored": len(rankings),
        "average_gmi_score": avg_gmi,
        "highest_gmi_score": top_score,
        "leaderboard": rankings,
        "scoring_weights": {
            "lsci_weight": 0.25,
            "teu_volume_weight": 0.25,
            "clean_energy_weight": 0.30,
            "energy_independence_weight": 0.20
        }
    }

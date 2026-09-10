import pandas as pd
import numpy as np

def compute_overview_kpis(df: pd.DataFrame, min_year: int = None, max_year: int = None, country_code: str = None, include_aggregates: bool = False):
    filtered_df = df.copy()

    if not include_aggregates and 'is_aggregate' in filtered_df.columns:
        filtered_df = filtered_df[filtered_df['is_aggregate'] == False]
    
    if country_code and country_code.upper() != 'ALL':
        filtered_df = filtered_df[filtered_df['country_code'] == country_code.upper()]
    
    if min_year is not None:
        filtered_df = filtered_df[filtered_df['year'] >= min_year]
    if max_year is not None:
        filtered_df = filtered_df[filtered_df['year'] <= max_year]

    if filtered_df.empty:
        return {
            "countries_count": 0,
            "total_container_teu": 0.0,
            "avg_lsci": 0.0,
            "avg_fossil_fuel_pct": 0.0,
            "avg_energy_imports_pct": 0.0,
            "yearly_trends": []
        }

    # Latest year in selection
    latest_yr = filtered_df['year'].max()
    latest_df = filtered_df[filtered_df['year'] == latest_yr]

    total_countries = int(filtered_df['country_code'].nunique())
    total_teu = float(latest_df['container_port_traffic_teu'].sum())
    avg_lsci = float(latest_df[latest_df['lsci'] > 0]['lsci'].mean()) if not latest_df[latest_df['lsci'] > 0].empty else 0.0
    avg_fossil = float(latest_df['fossil_fuel_pct'].mean())
    avg_energy = float(latest_df['energy_imports_pct'].mean())

    # Calculate global/filtered yearly trends
    yearly_grouped = filtered_df.groupby('year').agg({
        'container_port_traffic_teu': 'sum',
        'lsci': lambda x: float(x[x > 0].mean()) if len(x[x > 0]) > 0 else 0.0,
        'fossil_fuel_pct': 'mean',
        'energy_imports_pct': 'mean'
    }).reset_index()

    yearly_trends = []
    for idx, row in yearly_grouped.iterrows():
        yearly_trends.append({
            "year": int(row['year']),
            "total_teu": round(float(row['container_port_traffic_teu']), 0),
            "avg_lsci": round(float(row['lsci']), 2),
            "avg_fossil_fuel_pct": round(float(row['fossil_fuel_pct']), 2),
            "avg_energy_imports_pct": round(float(row['energy_imports_pct']), 2)
        })

    return {
        "summary": {
            "countries_analyzed": total_countries,
            "latest_year": int(latest_yr) if not np.isnan(latest_yr) else 2024,
            "total_container_traffic_teu": round(total_teu, 0),
            "avg_lsci": round(avg_lsci, 2),
            "avg_fossil_fuel_pct": round(avg_fossil, 2),
            "avg_energy_imports_pct": round(avg_energy, 2)
        },
        "yearly_trends": yearly_trends
    }

def compute_rankings(df: pd.DataFrame, target_year: int = None, include_aggregates: bool = False):
    filtered_df = df.copy()
    if not include_aggregates and 'is_aggregate' in filtered_df.columns:
        filtered_df = filtered_df[filtered_df['is_aggregate'] == False]

    if target_year is None:
        target_year = filtered_df['year'].max()

    yr_df = filtered_df[filtered_df['year'] == target_year].copy()
    if yr_df.empty:
        yr_df = filtered_df.sort_values('year').groupby('country_code').last().reset_index()

    # Top TEU leaders
    top_teu = yr_df.sort_values('container_port_traffic_teu', ascending=False).head(10)
    top_teu_list = [{
        "country_code": str(r['country_code']),
        "country_name": str(r['country_name']),
        "container_teu": round(float(r['container_port_traffic_teu']), 0),
        "lsci": round(float(r['lsci']), 2)
    } for _, r in top_teu.iterrows()]

    # Top LSCI leaders
    top_lsci = yr_df.sort_values('lsci', ascending=False).head(10)
    top_lsci_list = [{
        "country_code": str(r['country_code']),
        "country_name": str(r['country_name']),
        "lsci": round(float(r['lsci']), 2),
        "container_teu": round(float(r['container_port_traffic_teu']), 0)
    } for _, r in top_lsci.iterrows()]

    # Quadrant Analysis: LSCI vs TEU Volume Matrix
    med_lsci = yr_df['lsci'].median() if not yr_df.empty else 20.0
    med_teu = yr_df['container_port_traffic_teu'].median() if not yr_df.empty else 1000000.0

    quadrants = []
    for _, r in yr_df.iterrows():
        lsci_val = float(r['lsci'])
        teu_val = float(r['container_port_traffic_teu'])
        
        if lsci_val >= med_lsci and teu_val >= med_teu:
            quadrant = "High Connectivity - High Volume (Global Hubs)"
        elif lsci_val >= med_lsci and teu_val < med_teu:
            quadrant = "High Connectivity - Niche/Transshipment Ports"
        elif lsci_val < med_lsci and teu_val >= med_teu:
            quadrant = "Low Connectivity - High Domestic Volume"
        else:
            quadrant = "Emerging / Secondary Ports"

        quadrants.append({
            "country_code": str(r['country_code']),
            "country_name": str(r['country_name']),
            "lsci": round(lsci_val, 2),
            "container_teu": round(teu_val, 0),
            "fossil_fuel_pct": round(float(r['fossil_fuel_pct']), 2),
            "energy_imports_pct": round(float(r['energy_imports_pct']), 2),
            "quadrant": quadrant
        })

    return {
        "year": int(target_year),
        "top_ports_teu": top_teu_list,
        "top_lsci_leaders": top_lsci_list,
        "quadrant_matrix": quadrants,
        "medians": {
            "lsci_median": round(float(med_lsci), 2),
            "teu_median": round(float(med_teu), 0)
        }
    }

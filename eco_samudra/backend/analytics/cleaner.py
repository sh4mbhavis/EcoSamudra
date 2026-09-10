import os
import pandas as pd
import numpy as np

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "eco_samudra.csv")

def load_and_clean_data(csv_path: str = None) -> pd.DataFrame:
    if csv_path is None:
        csv_path = DATA_PATH
    
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at {csv_path}")

    df = pd.read_csv(csv_path)

    # Standardize column types
    df['year'] = df['year'].astype(int)
    df['lsci'] = pd.to_numeric(df['lsci'], errors='coerce').fillna(0.0)
    df['container_port_traffic_teu'] = pd.to_numeric(df['container_port_traffic_teu'], errors='coerce').fillna(0.0)
    df['fossil_fuel_pct'] = pd.to_numeric(df['fossil_fuel_pct'], errors='coerce').fillna(0.0)
    df['energy_imports_pct'] = pd.to_numeric(df['energy_imports_pct'], errors='coerce').fillna(0.0)
    
    # Ensure boolean is_aggregate flag
    if 'is_aggregate' in df.columns:
        df['is_aggregate'] = df['is_aggregate'].astype(int).astype(bool)
    else:
        df['is_aggregate'] = False

    # Handle post-2015 fossil fuel & energy values (avoid negative or nonsensical artifacts)
    df['fossil_fuel_pct'] = df['fossil_fuel_pct'].clip(lower=0.0, upper=100.0)
    df['energy_imports_pct'] = df['energy_imports_pct'].clip(lower=-100.0, upper=100.0)
    df['lsci'] = df['lsci'].clip(lower=0.0)
    df['container_port_traffic_teu'] = df['container_port_traffic_teu'].clip(lower=0.0)

    # Sort deterministically
    df = df.sort_values(by=['country_code', 'year']).reset_index(drop=True)
    return df

def get_country_list(df: pd.DataFrame):
    """Returns list of countries with metadata (ISO code, name, start year, end year, is_aggregate)."""
    countries = []
    grouped = df.groupby(['country_code', 'country_name', 'is_aggregate'])
    for (code, name, is_agg), group in grouped:
        latest = group.sort_values('year').iloc[-1]
        countries.append({
            "country_code": str(code),
            "country_name": str(name),
            "is_aggregate": bool(is_agg),
            "min_year": int(group['year'].min()),
            "max_year": int(group['year'].max()),
            "record_count": int(len(group)),
            "latest_lsci": round(float(latest['lsci']), 2),
            "latest_teu": round(float(latest['container_port_traffic_teu']), 0),
            "latest_fossil_fuel_pct": round(float(latest['fossil_fuel_pct']), 2),
            "latest_energy_imports_pct": round(float(latest['energy_imports_pct']), 2),
        })
    return sorted(countries, key=lambda x: x['country_name'])

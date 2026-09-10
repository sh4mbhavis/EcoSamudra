from fastapi import APIRouter, Query, HTTPException
from analytics.cleaner import load_and_clean_data, get_country_list
from analytics.metrics import compute_overview_kpis, compute_rankings

router = APIRouter(prefix="/api", tags=["Analytics"])

# Global dataframe state
df = load_and_clean_data()

@router.get("/overview")
def get_overview(
    min_year: int = Query(None, description="Start year filter"),
    max_year: int = Query(None, description="End year filter"),
    country_code: str = Query(None, description="Country ISO code filter"),
    include_aggregates: bool = Query(False, description="Include regional economic aggregates")
):
    return compute_overview_kpis(df, min_year, max_year, country_code, include_aggregates)

@router.get("/countries")
def get_countries():
    return get_country_list(df)

@router.get("/country/{country_code}")
def get_country_detail(country_code: str):
    code = country_code.upper()
    country_df = df[df['country_code'] == code].sort_values('year')
    if country_df.empty:
        raise HTTPException(status_code=404, detail=f"Country code '{code}' not found.")

    latest = country_df.iloc[-1]
    history = country_df.to_dict(orient='records')
    
    # Format float fields cleanly
    clean_history = [{
        "year": int(r['year']),
        "lsci": round(float(r['lsci']), 2),
        "container_port_traffic_teu": round(float(r['container_port_traffic_teu']), 0),
        "fossil_fuel_pct": round(float(r['fossil_fuel_pct']), 2),
        "energy_imports_pct": round(float(r['energy_imports_pct']), 2)
    } for r in history]

    return {
        "country_code": code,
        "country_name": str(latest['country_name']),
        "is_aggregate": bool(latest['is_aggregate']),
        "latest_year": int(latest['year']),
        "latest_metrics": {
            "lsci": round(float(latest['lsci']), 2),
            "container_port_traffic_teu": round(float(latest['container_port_traffic_teu']), 0),
            "fossil_fuel_pct": round(float(latest['fossil_fuel_pct']), 2),
            "energy_imports_pct": round(float(latest['energy_imports_pct']), 2)
        },
        "history": clean_history
    }

@router.get("/country/compare")
def compare_countries(country1: str = Query(..., description="First country code"), country2: str = Query(..., description="Second country code")):
    c1_code, c2_code = country1.upper(), country2.upper()
    
    df1 = df[df['country_code'] == c1_code].sort_values('year')
    df2 = df[df['country_code'] == c2_code].sort_values('year')
    
    if df1.empty:
        raise HTTPException(status_code=404, detail=f"Country '{c1_code}' not found.")
    if df2.empty:
        raise HTTPException(status_code=404, detail=f"Country '{c2_code}' not found.")

    c1_latest = df1.iloc[-1]
    c2_latest = df2.iloc[-1]

    # Synchronize years for time-series comparison
    years = sorted(list(set(df1['year'].tolist() + df2['year'].tolist())))
    df1_dict = df1.set_index('year').to_dict(orient='index')
    df2_dict = df2.set_index('year').to_dict(orient='index')

    comparison_history = []
    for yr in years:
        row1 = df1_dict.get(yr, {})
        row2 = df2_dict.get(yr, {})
        comparison_history.append({
            "year": yr,
            f"{c1_code}_lsci": round(float(row1.get('lsci', 0.0)), 2) if row1 else None,
            f"{c2_code}_lsci": round(float(row2.get('lsci', 0.0)), 2) if row2 else None,
            f"{c1_code}_teu": round(float(row1.get('container_port_traffic_teu', 0.0)), 0) if row1 else None,
            f"{c2_code}_teu": round(float(row2.get('container_port_traffic_teu', 0.0)), 0) if row2 else None,
            f"{c1_code}_fossil": round(float(row1.get('fossil_fuel_pct', 0.0)), 2) if row1 else None,
            f"{c2_code}_fossil": round(float(row2.get('fossil_fuel_pct', 0.0)), 2) if row2 else None,
            f"{c1_code}_energy_imports": round(float(row1.get('energy_imports_pct', 0.0)), 2) if row1 else None,
            f"{c2_code}_energy_imports": round(float(row2.get('energy_imports_pct', 0.0)), 2) if row2 else None,
        })

    return {
        "country1": {
            "code": c1_code,
            "name": str(c1_latest['country_name']),
            "latest": {
                "lsci": round(float(c1_latest['lsci']), 2),
                "teu": round(float(c1_latest['container_port_traffic_teu']), 0),
                "fossil_fuel_pct": round(float(c1_latest['fossil_fuel_pct']), 2),
                "energy_imports_pct": round(float(c1_latest['energy_imports_pct']), 2),
            }
        },
        "country2": {
            "code": c2_code,
            "name": str(c2_latest['country_name']),
            "latest": {
                "lsci": round(float(c2_latest['lsci']), 2),
                "teu": round(float(c2_latest['container_port_traffic_teu']), 0),
                "fossil_fuel_pct": round(float(c2_latest['fossil_fuel_pct']), 2),
                "energy_imports_pct": round(float(c2_latest['energy_imports_pct']), 2),
            }
        },
        "comparison_history": comparison_history
    }

@router.get("/analytics")
def get_analytics(
    year: int = Query(None, description="Year for rankings"),
    include_aggregates: bool = Query(False, description="Include aggregates")
):
    return compute_rankings(df, target_year=year, include_aggregates=include_aggregates)

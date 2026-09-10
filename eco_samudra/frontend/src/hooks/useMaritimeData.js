import { useState, useEffect, useCallback } from 'react';
import { fetchCountries, fetchOverview } from '../services/api';

export const useMaritimeData = () => {
  const [countries, setCountries] = useState([]);
  const [filters, setFilters] = useState({
    countryCode: 'ALL',
    minYear: 1970,
    maxYear: 2024,
    includeAggregates: false,
  });

  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load country list on mount
  useEffect(() => {
    fetchCountries()
      .then(data => setCountries(data))
      .catch(err => console.error("Error loading countries:", err));
  }, []);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOverview({
        country_code: filters.countryCode !== 'ALL' ? filters.countryCode : undefined,
        min_year: filters.minYear,
        max_year: filters.maxYear,
        include_aggregates: filters.includeAggregates,
      });
      setOverviewData(data);
    } catch (err) {
      console.error("Failed to load overview data:", err);
      setError("Failed to fetch maritime dataset metrics.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      countryCode: 'ALL',
      minYear: 1970,
      maxYear: 2024,
      includeAggregates: false,
    });
  };

  return {
    countries,
    filters,
    updateFilters,
    resetFilters,
    overviewData,
    loading,
    error,
    refresh: loadOverview
  };
};

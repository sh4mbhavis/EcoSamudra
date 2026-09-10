import React, { useState, useEffect } from 'react';
import { Ship, Anchor, Activity, ScatterChart } from 'lucide-react';
import { fetchAnalytics } from '../services/api';
import { WorldMapRanking } from '../components/WorldMapRanking';
import { ScatterQuadrantChart } from '../charts/ScatterQuadrantChart';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';

export const MaritimeAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics()
      .then(data => {
        setAnalyticsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Analytics fetch error:", err);
        setError("Failed to fetch maritime analytics data.");
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingState message="Computing Maritime Connectivity Rankings & Quadrant Matrix..." />;
  if (error) return <ErrorState message={error} />;

  const topPorts = analyticsData?.top_ports_teu || [];
  const topLsci = analyticsData?.top_lsci_leaders || [];
  const quadrantMatrix = analyticsData?.quadrant_matrix || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Ship className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Maritime Analytics & Port Capacity Deep-Dive</h1>
            <p className="text-xs text-slate-400">Global LSCI Liner Connectivity, Container TEU Throughput, and Quadrant Matrix Analysis</p>
          </div>
        </div>
      </div>

      {/* Rankings Leaderboards */}
      <WorldMapRanking topPorts={topPorts} topLsci={topLsci} />

      {/* Quadrant Correlation Matrix Scatter Plot */}
      <ScatterQuadrantChart data={quadrantMatrix} />
    </div>
  );
};

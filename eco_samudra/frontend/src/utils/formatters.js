export const formatTEU = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0 TEU';
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B TEU`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M TEU`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k TEU`;
  return `${Math.round(num).toLocaleString()} TEU`;
};

export const formatPct = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '0.0%';
  return `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;
};

export const getTierBadge = (tier) => {
  if (!tier) return { label: 'B', bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' };
  if (tier.includes('A+')) return { label: 'Leader (A+)', bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/40' };
  if (tier.includes('A')) return { label: 'Advanced (A)', bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/40' };
  if (tier.includes('B')) return { label: 'Moderate (B)', bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/40' };
  return { label: 'Developing (C)', bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/40' };
};

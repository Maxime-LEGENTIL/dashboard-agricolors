'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';

export default function DashboardOrders() {
  const [stats, setStats] = useState<{ label: string; count: number | string }[]>([]);
  const [evolution, setEvolution] = useState<{ date: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        setStats(data.stats);
        setEvolution(data.evolution);
        setLastUpdate(new Date());
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-800 text-white text-sm rounded-lg px-4 py-2 shadow-lg border border-zinc-700">
          <p className="font-semibold">{label}</p>
          <p>
            <span className="text-zinc-400">Valeur :</span> {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const orderStats = Array.isArray(stats) ? stats.filter(s => s.label.startsWith('Commandes')) : [];
  const panierStats = Array.isArray(stats) ? stats.filter(s => s.label.startsWith('Panier')) : [];

  return (
    <div className="p-6 sm:p-10 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-5xl mx-auto mt-5">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">Statistiques des commandes</h1>
        {lastUpdate && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
            Dernière mise à jour : {lastUpdate.toLocaleString()}
          </span>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-zinc-500 dark:text-zinc-300">
          Chargement des statistiques...
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">
          ⚠️ {error}
        </div>
      ) : (
        <>
          {/* Graphique commandes */}
          {orderStats.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg font-semibold text-zinc-700 dark:text-white mb-2">
                Volume de commandes
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={orderStats}>
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="count"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                    label={{ fill: '#ffffff', fontSize: 12 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Panier moyen */}
          {panierStats.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg font-semibold text-zinc-700 dark:text-white mb-2">
                Panier moyen
              </h2>
              <ul className="space-y-2 text-sm text-zinc-800 dark:text-zinc-200">
                {panierStats.map((item, index) => (
                  <li key={index} className="flex justify-between bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-md">
                    <span>{item.label}</span>
                    <span className="font-bold">{item.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Évolution des commandes */}
          {evolution.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg font-semibold text-zinc-700 dark:text-white mb-2">
                Évolution quotidienne des commandes
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolution}>
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardClients() {
  const [stats, setStats] = useState<{ label: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    fetch('/api/clients') // ⬅️ adapte ce chemin à ton API réelle
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors du chargement des stats clients.');
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLastUpdate(new Date());
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 sm:p-10 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-5xl mx-auto mt-5">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
          Statistiques des clients
        </h1>
        {lastUpdate && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
            Dernière mise à jour : {lastUpdate.toLocaleString()}
          </span>
        )}
      </div>

      {loading && (
        <div className="text-center py-20 text-zinc-500 dark:text-zinc-300">
          Chargement des statistiques...
        </div>
      )}

      {error && (
        <div className="text-center py-20 text-red-500">
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && stats.length > 0 && (
        <>
          <div className="mb-10 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto mt-6">
            <table className="w-full text-left border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden text-sm">
              <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                <tr>
                  <th className="px-4 py-3">Statistiques clients</th>
                  <th className="px-4 py-3">Nombre</th>
                </tr>
              </thead>
              <tbody className="text-zinc-700 dark:text-zinc-200">
                {stats.map((item, index) => (
                  <tr
                    key={index}
                    className="even:bg-zinc-50 dark:even:bg-zinc-800"
                  >
                    <td className="px-4 py-3">{item.label}</td>
                    <td className="px-4 py-3 font-semibold">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && stats.length === 0 && !error && (
        <div className="text-center py-20 text-zinc-500 dark:text-zinc-300">
          Aucune donnée client à afficher pour le moment.
        </div>
      )}
    </div>
  );
}

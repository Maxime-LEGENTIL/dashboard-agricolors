'use client';

import { useRouter } from 'next/navigation';
import { LucideBarChart2, LucideUser, LucideClipboardList, LucideBox, LucideEuro } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const cards = [
    {
      title: 'Stats menu',
      icon: <LucideBarChart2 size={28} />,
      path: '/dashboard/menu',
      bg: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: 'Stats client',
      icon: <LucideUser size={28} />,
      path: '/dashboard/clients',
      bg: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: 'Stats commandes',
      icon: <LucideClipboardList size={28} />,
      path: '/dashboard/commandes',
      bg: 'bg-yellow-100 dark:bg-yellow-900',
    },
    {
      title: 'Stats produits',
      icon: <LucideBox size={28} />,
      path: '/dashboard/produits',
      bg: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      title: 'Stats ventes',
      icon: <LucideEuro size={28} />,
      path: '/dashboard/ventes',
      bg: 'bg-red-100 dark:bg-red-900',
    },
  ];

  return (
    <div className="min-h-screen px-6 sm:px-10 py-10 bg-white dark:bg-zinc-900">
      <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-8">📈 Tableau de bord PrestaShop</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => router.push(card.path)}
            className={`cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] p-6 rounded-2xl shadow-md dark:shadow-zinc-800 ${card.bg} text-zinc-800 dark:text-white flex items-center justify-between`}
          >
            <div>
              <h2 className="text-lg font-semibold mb-1">{card.title}</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">Voir les détails</p>
            </div>
            <div className="ml-4">{card.icon}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

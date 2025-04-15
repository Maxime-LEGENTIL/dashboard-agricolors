import { parseStringPromise } from 'xml2js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const apiKey = process.env.PRESTA_API_KEY!;
  const url = 'https://www.agricolors.fr/api/orders?display=[id,total_paid,date_add]';

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(apiKey + ':').toString('base64'),
        Accept: 'application/xml',
      },
    });

    const xml = await response.text();
    const json = await parseStringPromise(xml, { explicitArray: false });

    const rawOrders = json.prestashop.orders.order;
    const orders = Array.isArray(rawOrders) ? rawOrders : [rawOrders];

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    // Formatage
    const allOrders = orders.map((o) => ({
      date: new Date(o.date_add),
      total: parseFloat(o.total_paid),
    }));

    const ordersThisYear = allOrders.filter((o) => o.date >= startOfYear);
    const ordersThisWeek = allOrders.filter((o) => o.date >= sevenDaysAgo);

    // Moyennes
    const avg = (arr) =>
      arr.length ? (arr.reduce((sum, o) => sum + o.total, 0) / arr.length).toFixed(2) : '0.00';

    const stats = [
      { label: 'Commandes totales', count: allOrders.length },
      { label: 'Commandes cette année', count: ordersThisYear.length },
      { label: 'Commandes cette semaine', count: ordersThisWeek.length },
      { label: 'Panier moyen (global)', count: avg(allOrders) + ' €' },
      { label: 'Panier moyen (année)', count: avg(ordersThisYear) + ' €' },
      { label: 'Panier moyen (semaine)', count: avg(ordersThisWeek) + ' €' },
    ];

    // Évolution quotidienne
    const evolutionMap = {};
    allOrders.forEach((o) => {
      const dateStr = o.date.toISOString().split('T')[0];
      if (!evolutionMap[dateStr]) evolutionMap[dateStr] = 0;
      evolutionMap[dateStr]++;
    });

    const evolution = Object.entries(evolutionMap)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([date, count]) => ({ date, count }));

    return res.status(200).json({ stats, evolution });
  } catch (err: any) {
    return res.status(500).json({
      error: 'Erreur API ou parsing XML',
      message: err.message,
    });
  }
}

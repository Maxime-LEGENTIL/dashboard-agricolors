import { parseStringPromise } from 'xml2js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const apiKey = process.env.PRESTA_API_KEY!;
  const url = 'https://www.agricolors.fr/api/orders?display=[id,current_state,date_add]';

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(apiKey + ':').toString('base64'),
        Accept: 'application/xml',
      },
    });

    const xml = await response.text();
    const json = await parseStringPromise(xml, { explicitArray: false });

    const orders = Array.isArray(json.prestashop.orders.order)
      ? json.prestashop.orders.order
      : [json.prestashop.orders.order];

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const totalOrders = orders.length;

    // ⚠️ current_state est un ID de statut (ex : 3 = livrée, 5 = annulée, etc.)
    const delivered = orders.filter((o) => o.current_state === '5').length;
    const canceled = orders.filter((o) => o.current_state === '6').length;
    const pending = orders.filter((o) => o.current_state === '1').length;

    const recentOrders = orders.filter((o) => {
      const createdAt = new Date(o.date_add);
      return createdAt > thirtyDaysAgo;
    }).length;

    const result = [
      { label: 'Commandes totales', count: totalOrders },
      { label: 'Commandes en attente', count: pending },
      { label: 'Commandes livrées', count: delivered },
      { label: 'Commandes annulées', count: canceled },
      { label: 'Commandes 30 derniers jours', count: recentOrders },
    ];

    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({
      error: 'Erreur API ou parsing XML',
      message: err.message,
    });
  }
}

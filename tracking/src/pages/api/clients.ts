import { parseStringPromise } from 'xml2js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const apiKey = process.env.PRESTA_API_KEY!;
  const url = 'https://www.agricolors.fr/api/customers?display=[id,date_add,active]';

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(apiKey + ':').toString('base64'),
        Accept: 'application/xml',
      },
    });

    const xml = await response.text();
    const json = await parseStringPromise(xml, { explicitArray: false });

    const clients = Array.isArray(json.prestashop.customers.customer)
      ? json.prestashop.customers.customer
      : [json.prestashop.customers.customer];

    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const totalClients = clients.length;
    const activeClients = clients.filter((c) => c.active === '1').length;
    const newClients = clients.filter((c) => {
      const dateAdd = new Date(c.date_add);
      return dateAdd > sevenDaysAgo;
    }).length;

    const result = [
      { label: 'Clients totaux', count: totalClients },
      { label: 'Clients actifs', count: activeClients },
      { label: 'Nouveaux cette semaine', count: newClients },
    ];

    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({
      error: 'Erreur API ou parsing XML',
      message: err.message,
    });
  }
}

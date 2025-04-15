import { parseStringPromise } from 'xml2js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const apiKey = process.env.PRESTA_API_KEY!;
  const url = 'https://www.agricolors.fr/api/customers?display=[id,date_add,active,firstname,lastname,id_gender]';

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(apiKey + ':').toString('base64'),
        Accept: 'application/xml',
      },
    });

    const xml = await response.text();
    const json = await parseStringPromise(xml, { explicitArray: false });

    const rawClients = json.prestashop.customers.customer;
    const clients = Array.isArray(rawClients) ? rawClients : [rawClients];

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const totalClients = clients.length;

    const clientsThisYear = clients.filter((c) => {
      const date = new Date(c.date_add);
      return date >= startOfYear;
    }).length;

    const clientsThisWeek = clients.filter((c) => {
      const date = new Date(c.date_add);
      return date >= sevenDaysAgo;
    }).length;

    const genderCounts = {
      homme: 0,
      femme: 0,
      inconnu: 0,
    };

    clients.forEach((c) => {
      if (c.id_gender === '1') genderCounts.homme += 1;
      else if (c.id_gender === '2') genderCounts.femme += 1;
      else genderCounts.inconnu += 1;
    });

    const result = [
      { label: 'Clients totaux', count: totalClients },
      { label: 'Clients cette année', count: clientsThisYear },
      { label: 'Clients cette semaine', count: clientsThisWeek },
      { label: 'Hommes', count: genderCounts.homme },
      { label: 'Femmes', count: genderCounts.femme },
      { label: 'Sexe inconnu', count: genderCounts.inconnu },
    ];

    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({
      error: 'Erreur API ou parsing XML',
      message: err.message,
    });
  }
}

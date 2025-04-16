export default async function handler(req, res) {
  const fileUrl = 'https://www.agricolors.fr/logs_menu.json';

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      return res.status(500).json({ error: 'Impossible de charger logs_menu.json' });
    }

    const content = await response.text();
    const lines = content.trim().split('\n').map(line => JSON.parse(line));

    const counts: Record<string, number> = {};
    lines.forEach(log => {
      counts[log.category] = (counts[log.category] || 0) + 1;
    });

    const result = Object.entries(counts).map(([category, count]) => ({
      category,
      count,
    }));

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la lecture du fichier distant', message: err.message });
  }
}

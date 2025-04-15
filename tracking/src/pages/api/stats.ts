// tracking/src/pages/api/stats.ts
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'public', 'log.json');

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n').map(line => JSON.parse(line));

    const counts: Record<string, number> = {};
    lines.forEach(log => {
      counts[log.category] = (counts[log.category] || 0) + 1;
    });

    const result = Object.entries(counts).map(([category, count]) => ({ category, count }));
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Impossible de lire le fichier log.json' });
  }
}

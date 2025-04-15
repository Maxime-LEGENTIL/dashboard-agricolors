// tracking/src/components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <>
      {/* Bandeau d'information */}
      <div className="text-white text-center text-sm py-2" style={{ backgroundColor: "#e30616" }}>
        Cette application est strictement réservée à l'équipe d'Agricolors.fr.
      </div>

      {/* Header principal */}
      <header className="text-white p-4 shadow-md" style={{ backgroundColor: "#4A4A49" }}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Agricolors.fr</h1>
          <nav className="space-x-4">
            <Link href="/">Accueil</Link>
            <Link href="/dashboard">Dashboard</Link>
          </nav>
        </div>
      </header>
    </>
  );
}

import Link from 'next/link';
import Image from 'next/image';

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
          <Link href="/">
            <Image
              src="/logo-agricolors.jpg" // 📁 place ce fichier dans public/logo-agricolors.jpg
              alt="Logo Agricolors"
              width={140}
              height={50}
              priority
            />
          </Link>
        </div>
      </header>
    </>
  );
}

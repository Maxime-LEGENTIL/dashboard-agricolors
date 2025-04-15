// tracking/src/components/Footer.tsx
export default function Footer() {
    return (
      <footer
        className="text-center py-4 mt-10 text-sm text-white"
        style={{ backgroundColor: "#4A4A49" }}
      >
        © {new Date().getFullYear()} Agricolors. Tous droits réservés.
      </footer>
    );
  }
  
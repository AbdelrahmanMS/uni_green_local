import { Link } from "react-router";
import { ar } from "../lib/i18n";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-page text-center">
      <div className="text-6xl font-bold text-primary">404</div>
      <p className="text-muted">{ar.notFound}</p>
      <Link
        to="/"
        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-hover"
      >
        {ar.goHome}
      </Link>
    </div>
  );
}

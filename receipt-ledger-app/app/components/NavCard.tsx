import Link from "next/link";

interface NavCardProps {
  emoji: string;
  title: string;
  description: string;
  href: string;
}

export function NavCard({ emoji, title, description, href }: NavCardProps) {
  return (
    <Link href={href}>
      <div className="cursor-pointer rounded-lg border border-gray-300 shadow-sm hover:shadow-lg transition-all duration-200 p-6 text-center bg-white hover:bg-gray-50">
        <div className="text-4xl mb-2">{emoji}</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-1">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
}

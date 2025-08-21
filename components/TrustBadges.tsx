export function TrustBadges({ className = '' }: { className?: string }) {
  const items = [
    ['Free delivery', 'UK mainland delivery included'],
    ['Road tax included', 'For the full term unless stated'],
    ['No admin fees', 'Fair, transparent pricing'],
    ['Excellent reviews', 'Independent review platforms (TODO)']
  ];
  return (
    <ul className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-3 ${className}`}>
      {items.map(([title, desc]) => (
        <li key={title} className="border rounded p-3">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-slate-600">{desc}</p>
        </li>
      ))}
    </ul>
  );
}
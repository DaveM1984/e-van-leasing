export function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav className="text-sm text-slate-600 mb-3" aria-label="Breadcrumb">
      <ol className="flex flex-wrap gap-1">
        <li><a href="/vans" className="hover:underline">Vans</a></li>
        {items.map((item, i) => (
          <li key={i} className="flex gap-1">
            <span>/</span>
            {item.href ? <a href={item.href} className="hover:underline">{item.name}</a> : <span>{item.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
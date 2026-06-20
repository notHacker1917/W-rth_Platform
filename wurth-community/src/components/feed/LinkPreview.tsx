interface LinkPreviewData { url: string; title: string; description: string; imageUrl?: string; }
interface LinkPreviewProps { data: LinkPreviewData; }

export default function LinkPreview({ data }: LinkPreviewProps) {
  const hostname = (() => { try { return new URL(data.url).hostname.replace('www.', ''); } catch { return data.url; } })();
  return (
    <a href={data.url} target="_blank" rel="noopener noreferrer"
       className="block mt-3 border border-border rounded-xl overflow-hidden hover:border-accent
                  hover:shadow-sm hover:shadow-accent/20 transition-all group bg-surface-base">
      {data.imageUrl && (
        <div className="aspect-[2/1] overflow-hidden bg-surface-elevated">
          <img src={data.imageUrl} alt={data.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
        </div>
      )}
      <div className="p-3">
        <p className="text-xs text-text-muted uppercase tracking-wide mb-0.5">{hostname}</p>
        <p className="text-sm font-semibold text-text-primary line-clamp-1">{data.title}</p>
        <p className="text-xs text-text-muted line-clamp-2 mt-0.5">{data.description}</p>
      </div>
    </a>
  );
}

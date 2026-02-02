export function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-secondary rounded w-1/3"></div>
          <div className="h-8 bg-secondary rounded w-1/2"></div>
          <div className="h-3 bg-secondary rounded w-1/4"></div>
        </div>
        <div className="w-12 h-12 bg-secondary rounded-lg"></div>
      </div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 animate-pulse">
      <div className="mb-6">
        <div className="h-5 bg-secondary rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-secondary rounded w-1/4"></div>
      </div>
      <div className="h-64 bg-secondary rounded"></div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 animate-pulse">
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-secondary rounded w-3/4"></div>
              <div className="h-3 bg-secondary rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
          <div className="h-48 bg-secondary"></div>
          <div className="p-4 space-y-3">
            <div className="h-5 bg-secondary rounded w-3/4"></div>
            <div className="h-4 bg-secondary rounded w-full"></div>
            <div className="h-4 bg-secondary rounded w-5/6"></div>
            <div className="flex justify-between items-center mt-4">
              <div className="h-6 bg-secondary rounded w-1/4"></div>
              <div className="h-9 bg-secondary rounded w-1/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

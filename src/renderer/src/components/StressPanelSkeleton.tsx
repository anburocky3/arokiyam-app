export const StressPanelSkeleton = (): React.JSX.Element => {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="h-32 rounded-2xl border border-slate-200/70 bg-white/70 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70" />
      <div className="h-32 rounded-2xl border border-slate-200/70 bg-white/70 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70" />
      <div className="h-40 rounded-2xl border border-slate-200/70 bg-white/70 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70 lg:col-span-2" />
    </div>
  )
}

export const StressPanelError = (): React.JSX.Element => {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
      Stress monitor is unavailable. Check the main process logs for hook errors.
    </div>
  )
}

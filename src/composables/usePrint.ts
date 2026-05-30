// Print — trigger browser print with A4 layout
export function usePrint() {
  function triggerPrint(): void {
    window.print()
  }

  return { triggerPrint }
}

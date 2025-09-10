export function formatUnixTimestampToDate(tsSeconds: number): string {
    const date = new Date(tsSeconds * 1000);
    return date.toISOString().slice(0,10)
}

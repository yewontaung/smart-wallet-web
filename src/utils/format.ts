/**
 * Formats a number (or numeric string) into a comma-separated string.
 * Handles decimals — pass `decimals` to force a fixed decimal count,
 * or omit it to preserve whatever decimals were present (trimmed).
 *
 * formatAmount(100000000) -> "100,000,000"
 * formatAmount(100000000.5) -> "100,000,000.5"
 * formatAmount(100000000.5, 2) -> "100,000,000.50"
 * formatAmount(100000000, 2) -> "100,000,000.00"
 */
export function formatAmount(value: number | string, decimals?: number): string {
    if (value === "" || value === null || value === undefined) return "";

    const numeric = typeof value === "string" ? value.replace(/,/g, "") : value;
    const num = Number(numeric);

    if (isNaN(num)) return "";

    return num.toLocaleString("en-US", {
        minimumFractionDigits: decimals ?? 0,
        maximumFractionDigits: decimals ?? 6, // preserves natural decimals when not forced
    });
}

/**
 * Strips formatting back to a plain numeric string (keeps a single decimal point).
 * e.g. parseAmount("100,000,000.02") -> "100000000.02"
 */
export function parseAmount(formatted: string): string {
    const cleaned = formatted.replace(/,/g, "").replace(/[^\d.]/g, "");
    // guard against multiple decimal points
    const [whole, ...rest] = cleaned.split(".");
    return rest.length ? `${whole}.${rest.join("")}` : whole;
}

/**
 * Formats with a currency/unit suffix.
 * e.g. formatAmountWithUnit(100000000, "ks") -> "100,000,000 ks"
 */
export function formatAmountWithUnit(value: number | string, unit = "ks", decimals?: number): string {
    const formatted = formatAmount(value, decimals);
    return formatted ? `${formatted} ${unit}` : "";
}

/**
 * Splits an amount into whole and decimal parts for "big number, small decimal"
 * display styles, e.g.:
 *   <span className="text-4xl">{whole}</span><small>.{decimal} mmk</small>
 *
 * splitAmount(1000000000.02) -> { whole: "1,000,000,000", decimal: "02" }
 * splitAmount(1000000000) -> { whole: "1,000,000,000", decimal: "00" }
 */
export function splitAmount(value: number | string, decimals = 2): { whole: string; decimal: string } {
    const numeric = typeof value === "string" ? value.replace(/,/g, "") : value;
    const num = Number(numeric);

    if (isNaN(num)) return { whole: "0", decimal: "0".repeat(decimals) };

    const fixed = num.toFixed(decimals); // "1000000000.02"
    const [wholePart, decimalPart] = fixed.split(".");

    return {
        whole: Number(wholePart).toLocaleString("en-US"),
        decimal: decimalPart,
    };
}

export function formatAccountNumber(account: string) {
    const clean = account.replace(/\s/g, "");

    if (clean.length <= 4) {
        return clean;
    }

    return `•••• •••• ${clean.slice(-4)}`;
}

export function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(date));
}
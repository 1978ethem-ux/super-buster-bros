// Super Buster Bros - Input sanitization helpers
// localStorage is fully attacker/user-controlled (devtools, other scripts on the
// same origin, extensions). Every value read out of it must be coerced to a
// known-safe primitive before it is used in comparisons or rendered.

/**
 * Coerce an untrusted value to a safe, finite, non-negative integer.
 * Returns `fallback` for null/undefined/NaN/Infinity/objects/oversized values.
 * @param {*} value
 * @param {number} [fallback=0]
 * @param {number} [max=Number.MAX_SAFE_INTEGER]
 * @returns {number}
 */
export function safeInt(value, fallback = 0, max = Number.MAX_SAFE_INTEGER) {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    const i = Math.trunc(n);
    if (i < 0) return fallback;
    return Math.min(i, max);
}

/**
 * Format an untrusted numeric value for display with fixed-width zero padding.
 * Always returns a bounded-length digit string, so a tampered storage value
 * cannot blow up layout or smuggle markup.
 * @param {*} value
 * @param {number} [width=7]
 * @returns {string}
 */
export function formatScore(value, width = 7) {
    // 9999999 for width 7 -> keeps the HUD a fixed size no matter the input.
    const max = Math.pow(10, width) - 1;
    return safeInt(value, 0, max).toString().padStart(width, '0');
}

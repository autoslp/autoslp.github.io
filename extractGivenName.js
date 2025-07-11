/**
 * Extracts the given name (last word) from a full name.
 * @param {string} fullName
 * @returns {string}
 */
function extractGivenName(fullName) {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/);
    return parts[parts.length - 1] || '';
}

// Example usage:
console.log(extractGivenName("Nguyễn Duy Công")); // Output: "Công"
console.log(extractGivenName("Mr nguyễnduycông")); // Output: "nguyễnduycông"

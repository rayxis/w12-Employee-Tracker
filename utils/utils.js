/**
 * Capitalizes the first letter of the given string.
 *
 * @param {string} string - The string to capitalize.
 * @returns {string} The string with the first letter capitalized.
 */
export function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
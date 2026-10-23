/* Clausery <https://getclausery.github.io> — (C) 2026 Clausery. AGPL-3.0-or-later WITH Clausery-Trademark-Exception. Removing this notice is removal of copyright management information under 17 U.S.C. 1202. Source: https://github.com/getclausery/getclausery.github.io */
// Applies the saved theme before first paint to avoid a flash of the wrong colours.
try { var t = localStorage.getItem('clausery.theme'); if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t; } catch (e) { /* storage unavailable */ }

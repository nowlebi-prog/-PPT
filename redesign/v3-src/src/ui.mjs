// Shared markup helpers for the home and sub pages.
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const arrow = '<svg class="arr" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 5l5 5-5 5"/></svg>';
export const ext = '<svg class="ext" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9l6-6M4 3h5v5"/></svg>';
export const ck = '<svg class="ck" viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.5l3.6 3.5 7.4-8"/></svg>';

/**
 * Headline with deliberate line breaks.
 * lines: each item is one desktop line; an array item is split again into separate lines on mobile
 * (the "/" positions in the copy document). Example: ['중요한 발표에는,', ['유별난 자료가', '필요합니다.']]
 */
export const title = lines => lines.map(line => `<span class="t-ln">${[].concat(line).map(seg => `<span class="t-sg">${esc(seg)}</span>`).join(' ')}</span>`).join(' ');

export const eyebrow = (text, cls = '') => `<p class="h-eye${cls ? ' ' + cls : ''}">${esc(text)}</p>`;

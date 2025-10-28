// Minimal HTML sanitizer for rendering trusted admin-authored content
// Removes script/style tags, event handlers (on*), and javascript: URLs.
export function sanitizeHtml(input: string): string {
  if (!input) return "";
  // Remove script and style blocks entirely
  let html = input.replace(/<\/(?:script|style)>/gi, "");
  html = html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, "");
  // Strip on* event handler attributes
  html = html.replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "");
  html = html.replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "");
  html = html.replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "");
  // Disallow javascript: in href/src
  html = html.replace(/(href|src)\s*=\s*"javascript:[^"]*"/gi, '$1="#"');
  html = html.replace(/(href|src)\s*=\s*'javascript:[^']*'/gi, "$1='#'");
  html = html.replace(/(href|src)\s*=\s*javascript:[^\s>]+/gi, "$1=#");
  return html;
}

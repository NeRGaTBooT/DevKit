const CSS_DEMO_MARKUP = `
  <div class="center preview-shell">
    <div class="grid preview-grid">
      <div class="preview-card">Card 1</div>
      <div class="preview-card">Card 2</div>
      <div class="preview-card">Card 3</div>
    </div>
    <p class="truncate preview-text">
      Длинный текст для проверки обрезки и типографики в preview.
    </p>
    <div class="scrollable preview-scroll">
      <p>Scrollable area</p>
      <p>Line 2</p>
      <p>Line 3</p>
      <p>Line 4</p>
      <p>Line 5</p>
    </div>
    <button type="button" class="preview-button">Button</button>
  </div>
`;

const PREVIEW_BASE_STYLES = `
  :root {
    color-scheme: light dark;
    --border: #d4d4d8;
    --card: #ffffff;
    --foreground: #18181b;
    --muted: #71717a;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --border: #3f3f46;
      --card: #18181b;
      --foreground: #fafafa;
      --muted: #a1a1aa;
    }
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 16px;
    font-family: system-ui, -apple-system, sans-serif;
    color: var(--foreground);
    background: var(--card);
  }

  .preview-shell {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 100%;
  }

  .preview-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .preview-card {
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: color-mix(in srgb, var(--card) 90%, var(--foreground) 10%);
  }

  .preview-text {
    max-width: 220px;
    margin: 0;
  }

  .preview-scroll {
    max-height: 72px;
    overflow: auto;
    padding: 8px;
    border: 1px solid var(--border);
    border-radius: 8px;
  }

  .preview-button {
    width: fit-content;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: transparent;
    color: inherit;
  }
`;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function isFullHtmlDocument(code: string): boolean {
  return /<!doctype html|<html[\s>]/i.test(code.trim());
}

function buildCssPreviewDocument(code: string): string {
  return `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>${PREVIEW_BASE_STYLES}</style>
    <style>${code}</style>
  </head>
  <body>${CSS_DEMO_MARKUP}</body>
</html>`;
}

function buildHtmlPreviewDocument(code: string): string {
  const trimmed = code.trim();

  if (isFullHtmlDocument(trimmed)) {
    return trimmed;
  }

  return `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>${PREVIEW_BASE_STYLES}</style>
  </head>
  <body>${trimmed}</body>
</html>`;
}

export function isSnippetPreviewable(language: string): boolean {
  return language === "css" || language === "markup";
}

export function buildSnippetPreviewDocument(
  code: string,
  language: string,
): string | null {
  if (!isSnippetPreviewable(language)) return null;

  if (language === "css") {
    return buildCssPreviewDocument(code);
  }

  return buildHtmlPreviewDocument(code);
}

export function buildSnippetPreviewSrcDoc(
  code: string,
  language: string,
): string {
  const document = buildSnippetPreviewDocument(code, language);

  if (!document) {
    return `<!DOCTYPE html><html><body><pre>${escapeHtml(code)}</pre></body></html>`;
  }

  return document;
}

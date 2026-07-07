/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Shared helper to create a temporary anchor element and trigger a file download.
 * Cleans up the object URL immediately after clicking.
 */
function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Initiates download of a plain text file (e.g. README.md or roadmap.md)
 */
export function downloadTextFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  triggerDownload(blob, filename);
}

/**
 * Packages README.md and roadmap.md into a compressed ZIP file and triggers download.
 * Returns early if both content strings are empty to avoid creating an empty ZIP.
 */
export async function downloadZipPackage(
  readmeContent: string,
  roadmapContent: string,
  zipName: string = 'owlreadme-package.zip'
): Promise<void> {
  if (!readmeContent && !roadmapContent) return;
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  if (readmeContent) {
    zip.file('README.md', readmeContent);
  }
  if (roadmapContent) {
    zip.file('roadmap.md', roadmapContent);
  }
  const content = await zip.generateAsync({ type: 'blob' });
  triggerDownload(content, zipName);
}

/**
 * Creates a JSON file containing the serialized Zustand store data for recovery or portability
 */
export function downloadJsonBackup(
  readmeData: any,
  roadmapData: any,
  filename: string = 'owlreadme-backup.json'
): void {
  const backup = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    data: {
      readme: {
        name: readmeData.name,
        role: readmeData.role,
        about: readmeData.about,
        skills: readmeData.skills,
        projects: readmeData.projects,
        socials: readmeData.socials,
        avatarUrl: readmeData.avatarUrl,
        followers: readmeData.followers,
        following: readmeData.following,
        publicRepos: readmeData.publicRepos,
        template: readmeData.template,
      },
      roadmap: {
        title: roadmapData.title,
        steps: roadmapData.steps,
        template: roadmapData.template,
      },
    },
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json;charset=utf-8' });
  triggerDownload(blob, filename);
}

/**
 * Creates a temporary iframe, copies global stylesheet references, inserts the HTML
 * representing the styled markdown document, and opens the system print dialogue.
 *
 * Security: the title is HTML-escaped to prevent XSS injection.
 * Robustness: uses doc.open()/write()/close() (widely supported) with a null-check on
 * window.frameElement before removal.
 */
/**
 * Sanitizes HTML string by parsing it into a temporary document using DOMParser
 * and walking the DOM tree to strip out unwanted tags and attributes.
 */
export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Define safe tags list (including structural html/body container tags)
  const safeTags = new Set([
    'html', 'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr',
    'ul', 'ol', 'li', 'span', 'code', 'pre', 'img', 'a',
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div',
    'strong', 'em', 'del', 'ins', 'blockquote', 'details', 'summary',
    'input' // for task lists
  ]);

  // Define safe attributes list
  const safeAttributes = new Set([
    'class', 'style', 'id', 'href', 'src', 'alt', 'title', 'target', 'rel',
    'type', 'checked', 'disabled', 'colspan', 'rowspan', 'align'
  ]);

  // Traverse the tree and clean up elements
  const walk = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();

      // If tag is not safe, handle replacement or removal
      if (!safeTags.has(tagName)) {
        if (['script', 'iframe', 'object', 'embed', 'form', 'button', 'noscript'].includes(tagName)) {
          element.remove();
          return;
        }
        // Replace node with a safe span but keep its children
        const replacement = document.createElement('span');
        while (element.firstChild) {
          replacement.appendChild(element.firstChild);
        }
        element.parentNode?.replaceChild(replacement, element);
        walk(replacement);
        return;
      }

      // Clean attributes
      const attributes = Array.from(element.attributes);
      for (const attr of attributes) {
        const name = attr.name.toLowerCase();
        const isEvent = name.startsWith('on');
        const isJavaScriptUri = attr.value.trim().toLowerCase().startsWith('javascript:');
        const isSafeAttr = safeAttributes.has(name);

        if (isEvent || isJavaScriptUri || !isSafeAttr) {
          element.removeAttribute(attr.name);
        }
      }
    }

    // Recursively process children
    let child = node.firstChild;
    while (child) {
      const next = child.nextSibling;
      walk(child);
      child = next;
    }
  };

  // Walk children of doc.body to sanitize content in place
  let child = doc.body.firstChild;
  while (child) {
    const next = child.nextSibling;
    walk(child);
    child = next;
  }
  return doc.body.innerHTML;
}

/**
 * Creates a temporary iframe, copies global stylesheet references, inserts the HTML
 * representing the styled markdown document, and opens the system print dialogue.
 *
 * Security: the title is HTML-escaped and the HTML content is sanitized to prevent XSS.
 * Robustness: uses doc.open()/write()/close() with sandboxing enabled.
 */
export function exportToPdf(htmlContent: string, theme: string, title: string): void {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  
  // Sandbox the iframe securely
  iframe.setAttribute('sandbox', 'allow-modals allow-same-origin allow-scripts');
  
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) {
    console.error('Failed to create iframe for PDF rendering');
    document.body.removeChild(iframe);
    return;
  }

  // Sanitise the title to prevent XSS in the <title> tag
  const safeTitle = title.replace(/[<>&"']/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c] ?? c)
  );

  // Sanitise the content to prevent HTML injection XSS
  const safeHtmlContent = sanitizeHtml(htmlContent);

  // Gather stylesheet tags from parent document
  let styles = '';
  document.querySelectorAll('link[rel="stylesheet"], style').forEach((el) => {
    styles += el.outerHTML;
  });

  doc.open();
  doc.write(`<!DOCTYPE html>
<html>
  <head>
    <title>${safeTitle}</title>
    ${styles}
    <style>
      @media print {
        @page { margin: 1.5cm; }
        body {
          background: var(--background) !important;
          color: var(--foreground) !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
      body {
        padding: 24px;
        max-width: 900px;
        margin: 0 auto;
        background: var(--background);
        color: var(--foreground);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        transition: none !important;
      }
      .theme-preview-container {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        background: transparent !important;
      }
    </style>
  </head>
  <body class="theme-${theme}">
    <div class="theme-preview-container">
      ${safeHtmlContent}
    </div>
    <script>
      window.onload = function() {
        setTimeout(function() {
          window.print();
          setTimeout(function() {
            if (window.frameElement) window.frameElement.remove();
          }, 500);
        }, 500);
      };
    <\/script>
  </body>
</html>`);
  doc.close();
}

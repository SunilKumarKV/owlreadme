import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { downloadTextFile, downloadJsonBackup, downloadZipPackage, exportToPdf, sanitizeHtml } from '../export-utils';

describe('export-utils', () => {
  let appendSpy: any;
  let removeSpy: any;
  let clickMock: any;
  let createElementSpy: any;

  beforeEach(() => {
    clickMock = vi.fn();
    
    // Stub document methods
    createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const el = {
        tagName: tagName.toUpperCase(),
        href: '',
        download: '',
        style: {},
        setAttribute: vi.fn(),
        appendChild: vi.fn(),
        removeChild: vi.fn(),
        click: clickMock,
        contentDocument: {
          open: vi.fn(),
          write: vi.fn(),
          close: vi.fn(),
        },
        contentWindow: {
          document: {
            open: vi.fn(),
            write: vi.fn(),
            close: vi.fn(),
          },
        },
      } as unknown as HTMLElement;
      return el;
    });

    appendSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => ({} as any));
    removeSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => ({} as any));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should trigger a download for plain text file', () => {
    downloadTextFile('readme.md', 'Hello World');

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(clickMock).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('should trigger a JSON backup download with correct structure', () => {
    const readmeData = { name: 'Alice', role: 'Dev' };
    const roadmapData = { title: 'React', steps: [] };

    downloadJsonBackup(readmeData, roadmapData, 'backup.json');

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(clickMock).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('should generate zip package and trigger download', async () => {
    await downloadZipPackage('Readme Content', 'Roadmap Content', 'pkg.zip');

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(clickMock).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
  });

  it('should avoid zip generation if both contents are empty', async () => {
    await downloadZipPackage('', '', 'empty.zip');
    expect(createElementSpy).not.toHaveBeenCalled();
    expect(clickMock).not.toHaveBeenCalled();
  });

  it('should set up an iframe and print for exportToPdf', () => {
    const querySelectorSpy = vi.spyOn(document, 'querySelectorAll').mockReturnValue([] as any);

    exportToPdf('<h1>My Document</h1>', 'dark', 'My Page');

    expect(createElementSpy).toHaveBeenCalledWith('iframe');
    expect(appendSpy).toHaveBeenCalled();
    expect(querySelectorSpy).toHaveBeenCalledWith('link[rel="stylesheet"], style');
  });

  describe('sanitizeHtml', () => {
    it('should strip script tags and event handlers but keep formatting', () => {
      const dirty = '<div><h1>Title</h1><script>alert("xss")</script><p onclick="steal()">Hello</p></div>';
      const clean = sanitizeHtml(dirty);
      expect(clean).toContain('<h1>Title</h1>');
      expect(clean).toContain('<p>Hello</p>');
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('onclick');
    });

    it('should strip javascript protocol links', () => {
      const dirty = '<a href="javascript:alert(1)">Click here</a>';
      const clean = sanitizeHtml(dirty);
      expect(clean).not.toContain('href="javascript:');
    });
  });
});

import { sanitizeMarkdown } from '@/services/readme/markdown';

export class ReadmeBuilder {
  private sections: string[] = [];

  public addHeader(title: string, subtitle?: string, avatarUrl?: string): this {
    const parts: string[] = [];
    if (avatarUrl) {
      parts.push(`<p align="center">\n  <img src="${avatarUrl}" alt="Avatar" width="120" height="120" style="border-radius: 50%;" />\n</p>`);
    }
    if (title) {
      parts.push(`# ${title}`);
    }
    if (subtitle) {
      parts.push(`## ${subtitle}`);
    }
    if (parts.length > 0) {
      this.sections.push(parts.join('\n\n'));
    }
    return this;
  }

  public addSection(heading: string, content: string): this {
    if (!content || !content.trim()) return this;
    this.sections.push(`### ${heading}\n${content.trim()}`);
    return this;
  }

  public addRawBlock(rawMarkdown: string): this {
    if (rawMarkdown && rawMarkdown.trim()) {
      this.sections.push(rawMarkdown.trim());
    }
    return this;
  }

  public build(): string {
    return sanitizeMarkdown(this.sections.join('\n\n'));
  }
}

export default ReadmeBuilder;

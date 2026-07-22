import { describe, it, expect } from 'vitest';
import { TEMPLATE_MARKETPLACE, TemplateCategory } from '../template-registry';

describe('TEMPLATE_MARKETPLACE registry tests', () => {
  it('should contain at least 40 built-in templates', () => {
    expect(TEMPLATE_MARKETPLACE.length).toBeGreaterThanOrEqual(40);
  });

  it('should have unique IDs and valid required fields for all templates', () => {
    const ids = TEMPLATE_MARKETPLACE.map((t) => t.id);
    expect(ids.length).toBe(new Set(ids).size);

    TEMPLATE_MARKETPLACE.forEach((tpl) => {
      expect(tpl.id).toBeDefined();
      expect(tpl.name).toBeDefined();
      expect(tpl.description).toBeDefined();
      expect(tpl.category).toBeDefined();
      expect(tpl.difficulty).toMatch(/Beginner|Intermediate|Advanced/);
      expect(tpl.tags).toBeInstanceOf(Array);
      expect(tpl.tags.length).toBeGreaterThan(0);
      expect(tpl.author).toBeDefined();
      expect(tpl.config).toBeDefined();
      expect(tpl.config.header).toBeDefined();
      expect(tpl.config.githubStats).toBeDefined();
      expect(tpl.config.techStack).toBeDefined();
      expect(tpl.config.socialLinks).toBeDefined();
      expect(tpl.config.achievements).toBeDefined();
    });
  });

  it('should include all required built-in template examples', () => {
    const requiredNames = [
      'Minimal Developer',
      'Modern Portfolio',
      'GitHub Profile Pro',
      'Animated README',
      'Open Source Maintainer',
      'React Developer',
      'Next.js Developer',
      'Vue Developer',
      'Angular Developer',
      'Node.js Backend',
      'Python Developer',
      'Java Developer',
      'C++ Developer',
      'Rust Developer',
      'Go Developer',
      'Flutter Developer',
      'React Native',
      'Android Developer',
      'iOS Developer',
      'AI Engineer',
      'Machine Learning',
      'Data Scientist',
      'Cyber Security',
      'Cloud Engineer',
      'DevOps Engineer',
      'Docker Expert',
      'Kubernetes Engineer',
      'Game Developer',
      'Unity Developer',
      'Unreal Developer',
      'UI UX Designer',
      'Student Portfolio',
      'College Project',
      'Startup Founder',
      'Technical Writer',
      'Community Maintainer',
      'Freelancer',
      'Content Creator',
      'Hackathon Winner',
      'Researcher',
    ];

    requiredNames.forEach((name) => {
      const found = TEMPLATE_MARKETPLACE.some((t) => t.name.toLowerCase() === name.toLowerCase());
      expect(found).toBe(true);
    });
  });
});

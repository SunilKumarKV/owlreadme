import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DynamicLocalAIService, SecureAPIAIService, getAIService } from '../ai-service';

describe('ai-service utilities', () => {
  describe('DynamicLocalAIService', () => {
    const localService = new DynamicLocalAIService();

    it('should generate readme suggestions correctly', async () => {
      const profile = { name: 'Dev Guy', role: 'Builder' };
      const repos = {
        languages: [{ name: 'Go', count: 5 }],
        topStarred: [{ name: 'awesome-go', stars: 100 }],
      };
      
      const suggestions = await localService.generateReadmeSuggestions(profile, repos);
      expect(suggestions.introduction).toContain('Dev Guy');
      expect(suggestions.introduction).toContain('Builder');
      expect(suggestions.aboutMe).toContain('Go');
      expect(suggestions.aboutMe).toContain('awesome-go');
      expect(suggestions.skills).toContain('Go');
      expect(suggestions.projects).toContain('awesome-go');
    });

    it('should generate roadmap suggestions for frontend titles', async () => {
      const suggestions = await localService.generateRoadmapSuggestions('Frontend Engineer', []);
      expect(suggestions.technologies).toContain('Next.js');
      expect(suggestions.roadmapSteps[1]).toContain('Next.js App Router');
    });

    it('should generate roadmap suggestions for backend titles', async () => {
      const suggestions = await localService.generateRoadmapSuggestions('Backend Development', []);
      expect(suggestions.technologies).toContain('PostgreSQL');
      expect(suggestions.roadmapSteps[0]).toContain('Express');
    });

    it('should generate roadmap suggestions for devops titles', async () => {
      const suggestions = await localService.generateRoadmapSuggestions('DevOps pipeline', []);
      expect(suggestions.technologies).toContain('Terraform');
      expect(suggestions.roadmapSteps[1]).toContain('Terraform');
    });

    it('should generate profile suggestions correctly', async () => {
      const profile = { role: 'Full Stack', followers: 2 };
      const repos = { languages: [] };
      
      const suggestions = await localService.generateProfileSuggestions(profile, repos);
      expect(suggestions.improvedBio).toContain('Full Stack');
      expect(suggestions.githubImprovements).toContain('Publish additional repositories showing practical applications.');
      expect(suggestions.githubImprovements).toContain('Share projects on developer platforms to grow network connections.');
    });
  });

  describe('SecureAPIAIService', () => {
    let secureService: SecureAPIAIService;
    
    beforeEach(() => {
      vi.restoreAllMocks();
      secureService = new SecureAPIAIService();
    });

    it('should call fetch and return data if response is ok', async () => {
      const mockResult = { data: { aboutMe: 'Mocked bio' } };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResult,
      } as Response);

      const suggestions = await secureService.generateReadmeSuggestions({}, {});
      expect(global.fetch).toHaveBeenCalledWith('/api/ai', expect.any(Object));
      expect(suggestions).toEqual(mockResult.data);
    });

    it('should fallback to DynamicLocalAIService if fetch response is not ok', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal Error', useLocalFallback: true }),
      } as Response);

      const suggestions = await secureService.generateReadmeSuggestions({ name: 'Fallback Test' }, {});
      expect(suggestions.introduction).toContain('Fallback Test');
    });

    it('should fallback to DynamicLocalAIService if fetch throws network error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

      const suggestions = await secureService.generateRoadmapSuggestions('DevOps', []);
      expect(suggestions.technologies).toContain('Terraform');
    });
  });

  describe('getAIService', () => {
    it('should return a SecureAPIAIService instance', () => {
      const service = getAIService();
      expect(service).toBeInstanceOf(SecureAPIAIService);
    });
  });
});

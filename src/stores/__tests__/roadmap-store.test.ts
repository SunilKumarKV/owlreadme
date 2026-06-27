import { describe, it, expect, beforeEach } from 'vitest';
import useRoadmapStore from '../roadmap-store';

describe('useRoadmapStore', () => {
  beforeEach(() => {
    useRoadmapStore.getState().reset();
  });

  it('should initialize with default values', () => {
    const state = useRoadmapStore.getState();
    expect(state.title).toBe('');
    expect(state.steps).toEqual([]);
    expect(state.template).toBe('');
    expect(state.roadmapExportsCount).toBe(0);
    expect(state.templatesUsedCount).toBe(0);
  });

  it('should update fields using setField', () => {
    const store = useRoadmapStore.getState();
    store.setField('title', 'Learning React');
    store.setField('steps', ['Step 1', 'Step 2']);

    const updated = useRoadmapStore.getState();
    expect(updated.title).toBe('Learning React');
    expect(updated.steps).toEqual(['Step 1', 'Step 2']);
  });

  it('should update template and increment templatesUsedCount', () => {
    const store = useRoadmapStore.getState();
    store.setTemplate('frontend-developer');

    const updated = useRoadmapStore.getState();
    expect(updated.template).toBe('frontend-developer');
    expect(updated.templatesUsedCount).toBe(1);
  });

  it('should increment roadmap exports count', () => {
    const store = useRoadmapStore.getState();
    store.incrementRoadmapExports();
    expect(useRoadmapStore.getState().roadmapExportsCount).toBe(1);
  });

  it('should increment templates used count', () => {
    const store = useRoadmapStore.getState();
    store.incrementTemplatesUsed();
    expect(useRoadmapStore.getState().templatesUsedCount).toBe(1);
  });

  it('should reset state to initial values', () => {
    const store = useRoadmapStore.getState();
    store.setField('title', 'My Roadmap');
    store.setTemplate('backend');
    store.incrementRoadmapExports();

    store.reset();

    const resetState = useRoadmapStore.getState();
    expect(resetState.title).toBe('');
    expect(resetState.template).toBe('');
    expect(resetState.roadmapExportsCount).toBe(0);
    expect(resetState.templatesUsedCount).toBe(0);
  });
});

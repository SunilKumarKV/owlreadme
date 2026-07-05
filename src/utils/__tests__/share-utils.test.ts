/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import {
  encodeShareData,
  decodeShareData,
  validateREADMEData,
  validateRoadmapData
} from '../share-utils';

describe('share-utils', () => {
  describe('encode/decode round-trip', () => {
    it('should successfully round-trip valid README data', () => {
      const original = { name: 'Sunil', role: 'CTO', about: 'Working on codebases' };
      const encoded = encodeShareData(original);
      const decoded = decodeShareData(encoded, validateREADMEData);
      expect(decoded).not.toBeNull();
      expect(decoded?.name).toBe('Sunil');
      expect(decoded?.role).toBe('CTO');
      expect(decoded?.about).toBe('Working on codebases');
    });

    it('should successfully round-trip valid Roadmap data', () => {
      const original = { title: 'JS Roadmap', steps: ['Learn basic syntax', 'Learn promises'] };
      const encoded = encodeShareData(original);
      const decoded = decodeShareData(encoded, validateRoadmapData);
      expect(decoded).not.toBeNull();
      expect(decoded?.title).toBe('JS Roadmap');
      expect(decoded?.steps).toEqual(['Learn basic syntax', 'Learn promises']);
    });
  });

  describe('size safety guards', () => {
    it('should fail decoding if base64 string is too large (>256KB)', () => {
      const giantString = 'a'.repeat(262145);
      const decoded = decodeShareData(giantString);
      expect(decoded).toBeNull();
    });

    it('should return null for invalid base64 payloads', () => {
      const decoded = decodeShareData('invalid-base64-payload-###!!!');
      expect(decoded).toBeNull();
    });
  });

  describe('validateREADMEData schema', () => {
    it('should strip unrecognized properties and prototype polluting properties', () => {
      const payload = {
        name: 'Jane Doe',
        role: 'Developer',
        unknownProp: 'should be stripped',
        constructor: 'prototype pollution attempt',
        __proto__: { poll: 'polluted' }
      };

      const validated = validateREADMEData(payload);
      expect(validated).not.toBeNull();
      expect(validated?.name).toBe('Jane Doe');
      expect(validated?.role).toBe('Developer');
      expect((validated as any).unknownProp).toBeUndefined();
      expect(Object.prototype.hasOwnProperty.call(validated, 'constructor')).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(validated, '__proto__')).toBe(false);
    });

    it('should truncate strings that exceed length bounds', () => {
      const longName = 'a'.repeat(200);
      const payload = { name: longName };
      const validated = validateREADMEData(payload);
      expect(validated?.name?.length).toBe(100);
    });
  });

  describe('validateRoadmapData schema', () => {
    it('should clean up steps array and strip non-string members', () => {
      const payload = {
        title: 'Python roadmap',
        steps: ['Syntax', 123, 'OOP', { complex: true }]
      };
      const validated = validateRoadmapData(payload);
      expect(validated).not.toBeNull();
      expect(validated?.title).toBe('Python roadmap');
      expect(validated?.steps).toEqual(['Syntax', 'OOP']);
    });
  });
});

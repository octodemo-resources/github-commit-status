import { describe, it, expect } from 'vitest';
import { getRepository } from './commit-status';

describe('commit-status', () => {

  describe('#getRepository()', () => {

    it('should work with a valid repository', () => {
      const repo = getRepository('octodemo/bootstrap');
      expect(repo.owner).toBe('octodemo');
      expect(repo.repo).toBe('bootstrap');
    });

    it('should fail if no owner specified', () => {
      const repo = 'bootstrap';
      expect(() => getRepository(repo)).toThrowError(`Invalid repository '${repo}', expected format {owner}/{repo}.`);
    });
  });
});
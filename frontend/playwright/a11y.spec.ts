import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Automated checks align with WCAG 2.1 Level A/AA rules axe exposes via tags.
 * Section 508 Refresh aligns ICT testing with WCAG 2.0/2.1 — treat axe WCAG21-AA tags as baseline signals.
 */
test.describe('Accessibility (axe)', () => {
  test('login page passes WCAG 2.1 AA rules bundled in axe', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(results.violations, formatViolations(results.violations)).toEqual([]);
  });

  test('register page passes WCAG 2.1 AA rules bundled in axe', async ({ page }) => {
    await page.goto('/auth/register');
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(results.violations, formatViolations(results.violations)).toEqual([]);
  });
});

function formatViolations(violations: { id: string; description: string }[]): string {
  return violations.map((v) => `${v.id}: ${v.description}`).join('\n');
}

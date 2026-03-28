import { expect, Locator, type Page } from "@playwright/test";

export class ProfilePage {
  constructor(private readonly page: Page) {}

  async open(username: string): Promise<void> {
    await this.page.goto(`/#/profile/${username}`);
  }

  async expectArticleVisible(title: string): Promise<void> {
    await expect(this.page.getByRole("heading", { name: title })).toBeVisible();
  }

  async openFavorites(username: string): Promise<void> {
    await this.page.goto(`/#/profile/${username}/favorites`);
  }

  getFavoriteArticleBySlug(slug: string): Locator {
    return this.page.locator(".article-preview").filter({
      has: this.page.locator(`a.preview-link[href*="${slug}"]`),
    });
  }

  async expectFavoriteArticleVisible(slug: string): Promise<void> {
    const article = this.getFavoriteArticleBySlug(slug);
    await expect(article).toHaveCount(1);
    await expect(article).toBeVisible();
  }

  async unfavoriteArticleBySlug(slug: string): Promise<void> {
    await this.getFavoriteArticleBySlug(slug)
      .locator("button.btn.btn-sm.btn-outline-primary")
      .click();
  }

  async expectNoFavoritesMessage(username: string): Promise<void> {
    await expect(
      this.page.getByText(`${username} doesn't have favorites`),
    ).toBeVisible();
  }
}

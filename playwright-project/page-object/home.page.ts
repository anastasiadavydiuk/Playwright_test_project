import { expect, Locator, type Page } from "@playwright/test";

export class HomePage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/");
  }

  async expectYourFeedVisible(): Promise<void> {
    await expect(this.page.getByText("Your Feed")).toBeVisible();
  }

  async clickNewArticle(): Promise<void> {
    await this.page.getByRole("link", { name: "New Article" }).click();
  }

  async clickGlobalFeed(): Promise<void> {
    await this.page.getByText("Global Feed").click();
  }

  getArticlePreviewBySlug(slug: string): Locator {
    return this.page.locator(".article-preview").filter({
      has: this.page.locator(`a.preview-link[href*="${slug}"]`),
    });
  }

  async expectArticlePreviewVisible(slug: string): Promise<void> {
    const article = this.getArticlePreviewBySlug(slug);
    await expect(article).toHaveCount(1);
    await expect(article).toBeVisible();
  }

  async favoriteArticleBySlug(slug: string): Promise<void> {
    await this.getArticlePreviewBySlug(slug)
      .locator("button.btn.btn-sm.btn-outline-primary")
      .click();
  }
  async openUserFeed(username: string): Promise<void> {
    await this.page
      .locator(".nav-link.dropdown-toggle", { hasText: username })
      .click();
  }

  async expectAuthorVisible(username: string): Promise<void> {
    await expect(
      this.page.locator(`a.author[href="#/profile/${username}"]`),
    ).toBeVisible();
  }
}

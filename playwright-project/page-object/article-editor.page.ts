import { type Page } from "@playwright/test";
import type { ArticleData } from "../helpers/data/article-data";

export class ArticleEditorPage {
  constructor(private readonly page: Page) {}

  async fillTitle(title: string): Promise<void> {
    await this.page.getByPlaceholder("Article Title").fill(title);
  }

  async clearTitle(): Promise<void> {
    await this.page.getByPlaceholder("Article Title").clear();
  }

  async fillDescription(description: string): Promise<void> {
    await this.page
      .getByPlaceholder("What's this article about?")
      .fill(description);
  }

  async fillBody(body: string): Promise<void> {
    await this.page
      .getByPlaceholder("Write your article (in markdown)")
      .fill(body);
  }

  async fillArticleForm(article: ArticleData): Promise<void> {
    await this.fillTitle(article.title);
    await this.fillDescription(article.description);
    await this.fillBody(article.body);
  }

  async publishArticle(): Promise<void> {
    await this.page.getByRole("button", { name: "Publish Article" }).click();
  }

  async updateArticle(): Promise<void> {
    await this.page.getByRole("button", { name: "Update Article" }).click();
  }
}

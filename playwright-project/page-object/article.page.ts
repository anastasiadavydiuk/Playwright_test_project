import { expect, Locator, type Dialog, type Page } from "@playwright/test";

export class ArticlePage {
  constructor(private readonly page: Page) {}

  async open(slug: string): Promise<void> {
    await this.page.goto(`/#/article/${slug}`);
  }

  async expectTitleVisible(title: string): Promise<void> {
    await expect(this.page.getByRole("heading", { name: title })).toBeVisible();
  }

  async clickEditArticle(): Promise<void> {
    await this.page
      .getByRole("button", { name: " Edit Article" })
      .first()
      .click();
  }

  async clickDeleteArticle(): Promise<void> {
    await this.page
      .getByRole("button", { name: "Delete Article" })
      .first()
      .click();
  }

  async deleteArticleWithConfirm(): Promise<void> {
    this.page.once("dialog", async (dialog: Dialog) => {
      await dialog.accept();
    });

    await this.clickDeleteArticle();
  }

  async expectDeleteConfirmDialogAndAccept(): Promise<void> {
    this.page.once("dialog", async (dialog: Dialog) => {
      expect(dialog.type()).toBe("confirm");
      expect(dialog.message()).toContain("delete the article");
      await dialog.accept();
    });
  }
  async fillComment(commentText: string): Promise<void> {
    await this.page.getByPlaceholder("Write a comment...").fill(commentText);
  }

  async submitComment(): Promise<void> {
    await this.page.locator("button.btn-primary").click();
  }

  async addComment(commentText: string): Promise<void> {
    await this.fillComment(commentText);
    await this.submitComment();
  }

  async expectCommentVisible(commentText: string): Promise<void> {
    await expect(this.page.locator(".card .card-text")).toHaveText(commentText);
  }

  getCommentCardByText(commentText: string): Locator {
    return this.page.locator(".card", {
      has: this.page.locator(".card-text", { hasText: commentText }),
    });
  }

  async expectDeleteCommentConfirmDialogAndAccept(): Promise<void> {
    this.page.once("dialog", async (dialog: Dialog) => {
      expect(dialog.type()).toBe("confirm");
      expect(dialog.message()).toContain("Want to delete the comment?");
      await dialog.accept();
    });
  }

  async deleteCommentByText(commentText: string): Promise<void> {
    await this.getCommentCardByText(commentText)
      .locator("button:has(i.ion-trash-a)")
      .click();
  }

  async expectNoCommentsMessageVisible(): Promise<void> {
    await expect(
      this.page.locator("text=There are no comments yet..."),
    ).toBeVisible();
  }
  async followAuthor(username: string): Promise<void> {
    await this.page
      .getByRole("button", { name: new RegExp(`Follow ${username}`) })
      .first()
      .click();
  }
}

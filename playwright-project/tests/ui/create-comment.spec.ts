import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { createAndLoginUser } from "../../helpers/sign-up-sign-in";
import { createArticleViaAPI } from "../../helpers/create-article";
import { createCommentViaAPI } from "../../helpers/create-comment";
import { ArticlePage } from "../../page-object/article.page";

test("Verify that user can leave the comment", async ({ page, request }) => {
  const articlePage = new ArticlePage(page);

  const { token } = await createAndLoginUser(request, page);
  const { slug } = await createArticleViaAPI(request, token);
  const commentText = faker.lorem.words({ min: 2, max: 5 });

  await articlePage.open(slug);
  await articlePage.addComment(commentText);
  await articlePage.expectCommentVisible(commentText);
});

test("Verify that user can delete comment created via API", async ({
  request,
  page,
}) => {
  const articlePage = new ArticlePage(page);

  const { token } = await createAndLoginUser(request, page);
  const { slug } = await createArticleViaAPI(request, token);
  const commentText = faker.lorem.words({ min: 2, max: 5 });

  await createCommentViaAPI(request, token, slug, commentText);

  await articlePage.open(slug);
  await articlePage.expectCommentVisible(commentText);

  await articlePage.expectDeleteCommentConfirmDialogAndAccept();
  await articlePage.deleteCommentByText(commentText);

  const response = await request.get(`/api/articles/${slug}/comments`);

  expect(response.status()).toBe(200);

  const data = await response.json();
  expect(data.comments.length).toBe(0);

  await articlePage.open(slug);
  await articlePage.expectNoCommentsMessageVisible();
});

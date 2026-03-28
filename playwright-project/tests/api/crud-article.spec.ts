import test, { expect } from "@playwright/test";
import { createAndLoginUser } from "../../helpers/sign-up-sign-in";
import {
  createArticleViaAPI,
  deleteArticleViaAPI,
  getArticleViaAPI,
  updateArticleViaAPI,
} from "../../helpers/create-article";

test("article CRUD works via API", async ({ page, request }) => {
  const { token } = await createAndLoginUser(request, page);

  let createdArticle: Awaited<ReturnType<typeof createArticleViaAPI>>;
  let updatedArticle: Awaited<ReturnType<typeof updateArticleViaAPI>>;

  await test.step("Create article", async () => {
    createdArticle = await createArticleViaAPI(request, token);
    expect(createdArticle.slug).toBeTruthy();
  });

  await test.step("Get created article", async () => {
    const fetchedArticle = await getArticleViaAPI(request, createdArticle.slug);
    expect(fetchedArticle.title).toBe(createdArticle.title);
    expect(fetchedArticle.description).toBe(createdArticle.description);
    expect(fetchedArticle.body).toBe(createdArticle.body);
  });

  await test.step("Update article", async () => {
    updatedArticle = await updateArticleViaAPI(
      request,
      token,
      createdArticle.slug,
    );
    expect(updatedArticle.slug).toBeTruthy();
    expect(updatedArticle.title).not.toBe(createdArticle.title);
    expect(updatedArticle.description).not.toBe(createdArticle.description);
    expect(updatedArticle.body).not.toBe(createdArticle.body);
  });

  await test.step("Get updated article", async () => {
    const fetchedArticle = await getArticleViaAPI(request, updatedArticle.slug);
    expect(fetchedArticle.title).toBe(updatedArticle.title);
    expect(fetchedArticle.description).toBe(updatedArticle.description);
    expect(fetchedArticle.body).toBe(updatedArticle.body);
  });

  await test.step("Delete article", async () => {
    const response = await deleteArticleViaAPI(
      request,
      token,
      updatedArticle.slug,
    );
    expect(response.status()).toBe(200);
  });

  await test.step("Verify article is deleted", async () => {
    const response = await request.get(`/api/articles/${updatedArticle.slug}`);
    expect(response.status()).toBe(404);

    const errorBody = await response.json();
    expect(errorBody.errors.body).toContain("Article not found ");
  });
});

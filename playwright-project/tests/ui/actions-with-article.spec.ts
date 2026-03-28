import { test, expect } from "@playwright/test";
import { fakerDE as faker } from "@faker-js/faker";
import { createAndLoginUser } from "../../helpers/sign-up-sign-in";
import { createArticleViaAPI } from "../../helpers/create-article";
import { HomePage } from "../../page-object/home.page";
import { ArticleEditorPage } from "../../page-object/article-editor.page";
import { ArticlePage } from "../../page-object/article.page";
import { ProfilePage } from "../../page-object/profile.page";
import { generateArticleData } from "../../helpers/data/article-data";

test("user can create a new article", async ({ page, request }) => {
  const { username } = await createAndLoginUser(request, page);

  const homePage = new HomePage(page);
  const articleEditorPage = new ArticleEditorPage(page);
  const articlePage = new ArticlePage(page);
  const profilePage = new ProfilePage(page);

  const articleData = generateArticleData();

  await homePage.expectYourFeedVisible();
  await homePage.clickNewArticle();

  await articleEditorPage.fillArticleForm(articleData);

  await articleEditorPage.publishArticle();
  await articlePage.expectTitleVisible(articleData.title);
  await profilePage.open(username);
  await profilePage.expectArticleVisible(articleData.title);
});

test("user can delete article via UI", async ({ page, request }) => {
  const homePage = new HomePage(page);
  const articlePage = new ArticlePage(page);

  const { token } = await createAndLoginUser(request, page);
  const { slug, title } = await createArticleViaAPI(request, token);

  await articlePage.open(slug);
  await articlePage.expectDeleteConfirmDialogAndAccept();
  await articlePage.clickDeleteArticle();

  await page.waitForURL("**/#/");
  await homePage.clickGlobalFeed();
  await expect(page.getByText(title)).not.toBeVisible();
});

test("user can edit article's title via UI", async ({ page, request }) => {
  const articlePage = new ArticlePage(page);
  const articleEditorPage = new ArticleEditorPage(page);

  const { token } = await createAndLoginUser(request, page);
  const { slug } = await createArticleViaAPI(request, token);
  const titleUpdated = faker.lorem.words({ min: 2, max: 5 });

  await articlePage.open(slug);
  await articlePage.clickEditArticle();
  await articleEditorPage.clearTitle();
  await articleEditorPage.fillTitle(titleUpdated);
  await articleEditorPage.updateArticle();
  await articlePage.expectTitleVisible(titleUpdated);
});

test("user cannot create article with existed title via UI", async ({
  page,
  request,
}) => {
  const homePage = new HomePage(page);
  const articleEditorPage = new ArticleEditorPage(page);

  const { token } = await createAndLoginUser(request, page);
  const { title } = await createArticleViaAPI(request, token);

  const articleData = generateArticleData();

  await homePage.open();
  await homePage.clickNewArticle();
  await articleEditorPage.fillArticleForm({
    ...articleData,
    title,
  });

  const [response] = await Promise.all([
    page.waitForResponse("**/api/articles"),
    articleEditorPage.publishArticle(),
  ]);

  await expect(page.locator(".error-messages")).toBeVisible();

  expect(response.status()).toBe(422);
  const data = await response.json();
  expect(data.errors.body[0].trim()).toBe("Title already exists..");
});

import { test, expect } from "@playwright/test";
import { createAndLoginUser } from "../../helpers/sign-up-sign-in";
import { createArticleViaAPI } from "../../helpers/create-article";
import { HomePage } from "../../page-object/home.page";
import { ArticlePage } from "../../page-object/article.page";

test("Verify that second user can follow first user via UI", async ({
  page,
  request,
}) => {
  const homePage = new HomePage(page);
  const articlePage = new ArticlePage(page);

  const { token: user1Token, username: user1Username } =
    await createAndLoginUser(request, page);

  const { slug } = await createArticleViaAPI(request, user1Token);
  expect(slug).toBeTruthy();

  const { username: user2Username } = await createAndLoginUser(request, page);

  await articlePage.open(slug);
  await articlePage.followAuthor(user1Username);

  await homePage.open();
  await homePage.openUserFeed(user2Username);
  await homePage.expectAuthorVisible(user1Username);
  await homePage.expectArticlePreviewVisible(slug);
});

import { test } from "@playwright/test";
import { createAndLoginUser } from "../../helpers/sign-up-sign-in";
import { createArticleViaAPI } from "../../helpers/create-article";
import { favoriteArticleViaApi } from "../../helpers/favorite-article";
import { HomePage } from "../../page-object/home.page";
import { ProfilePage } from "../../page-object/profile.page";

test("Verify that User can add article to favorites", async ({
  page,
  request,
}) => {
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  const { token, username } = await createAndLoginUser(request, page);
  const { slug } = await createArticleViaAPI(request, token);

  await homePage.open();
  await homePage.clickGlobalFeed();
  await homePage.expectArticlePreviewVisible(slug);
  await homePage.favoriteArticleBySlug(slug);

  await profilePage.openFavorites(username);
  await profilePage.expectFavoriteArticleVisible(slug);
});

test("Verify that User can delete article from favorites", async ({
  page,
  request,
}) => {
  const profilePage = new ProfilePage(page);

  const { token, username } = await createAndLoginUser(request, page);
  const { slug } = await createArticleViaAPI(request, token);

  await favoriteArticleViaApi(request, token, slug);

  await profilePage.openFavorites(username);
  await profilePage.expectFavoriteArticleVisible(slug);
  await profilePage.unfavoriteArticleBySlug(slug);
  await page.reload();
  await profilePage.expectNoFavoritesMessage(username);
});

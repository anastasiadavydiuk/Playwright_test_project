import { test, expect } from "@playwright/test";
import { createAndLoginUser } from "../../helpers/sign-up-sign-in";
import { createArticleViaAPI } from "../../helpers/create-article";
import {
  deleteFavoriteArticleViaApi,
  favoriteArticleViaApi,
  getFavoriteArticlesViaAPI,
} from "../../helpers/favorite-article";

test("article can be added to and removed from favorites via API", async ({
  page,
  request,
}) => {
  const { token, username } = await createAndLoginUser(request, page);
  const { slug } = await createArticleViaAPI(request, token);

  await test.step("Add article to favorites", async () => {
    const article = await favoriteArticleViaApi(request, token, slug);
    expect(article.favorited).toBe(true);
    expect(article.favoritesCount).toBe(1);
  });

  await test.step("Verify article appears in favorites list", async () => {
    const { articles, articlesCount } = await getFavoriteArticlesViaAPI(
      request,
      username,
    );

    expect(articlesCount).toBe(1);
    expect(articles[0].slug).toBe(slug);
  });

  await test.step("Remove article from favorites", async () => {
    const unFavoriteArticle = await deleteFavoriteArticleViaApi(
      request,
      token,
      slug,
    );

    expect(unFavoriteArticle.favorited).toBe(false);
    expect(unFavoriteArticle.favoritesCount).toBe(0);
  });

  await test.step("Verify article is removed from favorites list", async () => {
    const { articles, articlesCount } = await getFavoriteArticlesViaAPI(
      request,
      username,
    );

    expect(articlesCount).toBe(0);
    expect(articles.find((article) => article.slug === slug)).toBeUndefined();
  });
});

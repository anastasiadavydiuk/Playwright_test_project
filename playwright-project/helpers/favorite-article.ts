export async function favoriteArticleViaApi(
  request: APIRequestContext,
  token: string,
  slug: string,
) {
  const response = await request.post(
    `http://localhost:3000/api/articles/${slug}/favorite`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );

  expect(response.ok()).toBeTruthy();

  const { article } = await response.json();

  return article as {
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: string[];
    favorited: boolean;
    favoritesCount: number;
  };
}

import { APIRequestContext, expect } from "@playwright/test";

export async function getFavoriteArticlesViaAPI(
  request: APIRequestContext,
  username: string,
  limit = 3,
  offset = 0,
) {
  const response = await request.get(
    `http://localhost:3000/api/articles?favorited=${username}&limit=${limit}&offset=${offset}`,
  );

  expect(response.ok()).toBeTruthy();

  const { articles, articlesCount } = await response.json();

  return {
    articles: articles as Array<{
      slug: string;
      title: string;
      description: string;
      body: string;
      tagList: string[];
      favorited: boolean;
      favoritesCount: number;
      createdAt: string;
      updatedAt: string;
      author: {
        username: string;
        bio: string | null;
        image: string | null;
        following: boolean;
        followersCount: number;
      };
    }>,

    articlesCount: articlesCount as number,
  };
}

export async function deleteFavoriteArticleViaApi(
  request: APIRequestContext,
  token: string,
  slug: string,
) {
  const response = await request.delete(
    `http://localhost:3000/api/articles/${slug}/favorite`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
  expect(response.ok()).toBeTruthy();

  const { article } = await response.json();
  return article as {
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: string[];
    favorited: boolean;
    favoritesCount: number;
  };
}

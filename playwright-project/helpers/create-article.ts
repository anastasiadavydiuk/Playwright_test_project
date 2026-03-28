import { faker } from "@faker-js/faker";
import { APIRequestContext } from "@playwright/test";

export async function createArticleViaAPI(
  request: APIRequestContext,
  token: string,
  {
    title = faker.lorem.words({ min: 2, max: 5 }),
    description = faker.lorem.sentence(),
    body = faker.lorem.paragraphs({ min: 1, max: 3 }),
    tagList = [],
  } = {},
) {
  const response = await request.post("http://localhost:3000/api/articles", {
    data: {
      article: {
        title,
        description,
        body,
        tagList,
      },
    },
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  const data = await response.json();
  return {
    slug: data.article.slug,
    title,
    description,
    body,
  };
}

export interface UpdatedArticleData {
  editedTitle: string;
  editedDescription: string;
  editedBody: string;
  tagList: string[];
}

export async function updateArticleViaAPI(
  request: APIRequestContext,
  token: string,
  slug: string,
  {
    editedTitle = faker.lorem.words({ min: 1, max: 2 }),
    editedDescription = faker.lorem.sentence(),
    editedBody = faker.lorem.paragraphs({ min: 3, max: 5 }),
    tagList = [],
  } = {},
) {
  const response = await request.put(
    `http://localhost:3000/api/articles/${slug}`,
    {
      data: {
        article: {
          title: editedTitle,
          description: editedDescription,
          body: editedBody,
          tagList,
        },
      },
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );

  const json = await response.json();
  const article = json.article;

  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    body: article.body,
    tagList: article.tagList ?? [],
  };
}

export async function getArticleViaAPI(
  request: APIRequestContext,
  slug: string,
) {
  const response = await request.get(
    `http://localhost:3000/api/articles/${slug}`,
  );

  const json = await response.json();
  return json.article;
}

export async function deleteArticleViaAPI(
  request: APIRequestContext,
  token: string,
  slug: string,
) {
  const response = await request.delete(
    `http://localhost:3000/api/articles/${slug}`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );

  return response;
}

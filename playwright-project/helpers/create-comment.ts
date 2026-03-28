import { APIRequestContext, expect } from "@playwright/test";

export async function createCommentViaAPI(
  request: APIRequestContext,
  token: string,
  slug: string,
  body: string,
) {
  const response = await request.post(
    `http://localhost:3000/api/articles/${slug}/comments`,
    {
      data: { comment: { body } },
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
  expect(response.status()).toBe(201);
  const data = await response.json();
  return data.comment.id as number;
}

export async function getCommentsViaAPI(
  request: APIRequestContext,
  slug: string,
) {
  const response = await request.get(
    `http://localhost:3000/api/articles/${slug}/comments`,
  );

  expect(response.ok()).toBeTruthy();

  const { comments } = await response.json();

  return comments as Array<{
    id: number;
    body: string;
    createdAt: string;
    updatedAt: string;
    author: {
      username: string;
      bio: string | null;
      image: string | null;
      following: boolean;
    };
  }>;
}

export async function deleteCommentViaAPI(
  request: APIRequestContext,
  token: string,
  slug: string,
  id: number,
) {
  const response = await request.delete(
    `http://localhost:3000/api/articles/${slug}/comments/${id}`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
  return response.json();
}

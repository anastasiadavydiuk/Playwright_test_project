import { test, expect } from "@playwright/test";
import { createAndLoginUser } from "../../helpers/sign-up-sign-in";
import { createArticleViaAPI } from "../../helpers/create-article";
import {
  createCommentViaAPI,
  deleteCommentViaAPI,
  getCommentsViaAPI,
} from "../../helpers/create-comment";
import { faker } from "@faker-js/faker";

test("comment can be created and deleted via API", async ({
  page,
  request,
}) => {
  const { token } = await createAndLoginUser(request, page);
  const { slug } = await createArticleViaAPI(request, token);
  const commentText = faker.lorem.words({ min: 2, max: 5 });

  let commentId: number;

  await test.step("Create comment", async () => {
    commentId = await createCommentViaAPI(request, token, slug, commentText);
    expect(commentId).toBeTruthy();
  });

  await test.step("Verify created comment exists", async () => {
    const comments = await getCommentsViaAPI(request, slug);
    const createdComment = comments.find((comment) => comment.id === commentId);

    expect(createdComment).toBeDefined();
    expect(createdComment?.body).toBe(commentText);
  });

  await test.step("Delete comment", async () => {
    const deleteResponse = await deleteCommentViaAPI(
      request,
      token,
      slug,
      commentId,
    );

    expect(deleteResponse).toEqual({
      message: { body: ["Comment deleted successfully"] },
    });
  });

  await test.step("Verify comment is deleted", async () => {
    const commentsAfterDelete = await getCommentsViaAPI(request, slug);

    expect(
      commentsAfterDelete.some((comment) => comment.id === commentId),
    ).toBe(false);

    const deletedComment = commentsAfterDelete.find(
      (comment) => comment.id === commentId,
    );
    expect(deletedComment).toBeUndefined();
  });
});

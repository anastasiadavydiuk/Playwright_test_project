import test, { expect } from "@playwright/test";
import {
  createAndLoginUser,
  getUserViaAPI,
  updateUserViaAPI,
} from "../../helpers/sign-up-sign-in";

test("Verify that user can be updated via API", async ({ page, request }) => {
  const { token, username, email } = await createAndLoginUser(request, page);

  const user = await getUserViaAPI(request, token);

  expect(user.email).toBe(email);
  expect(user.username).toBe(username);
  expect(user.bio).toBeNull();
  expect(user.image).toBeDefined();

  const updatedUserData = await updateUserViaAPI(request, token);

  expect(updatedUserData.email).not.toBe(user.email);
  expect(updatedUserData.username).not.toBe(user.username);
  expect(updatedUserData.bio).not.toBe(user.bio);
  expect(updatedUserData.image).not.toBe(user.image);

  expect(updatedUserData.token).toBeDefined();
});

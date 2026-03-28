import { faker } from "@faker-js/faker";
import { expect, type APIRequestContext, type Page } from "@playwright/test";

export async function createUser(request: APIRequestContext) {
  const fullNameRandom = faker.person.fullName();
  const sanitizedName = fullNameRandom
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ /g, ".")
    .toLowerCase();

  const numberRandom = faker.number.int();
  const email = `${sanitizedName}${numberRandom}@test.com`;
  const username =
    faker.person.firstName().toLowerCase() +
    faker.person.lastName().toLowerCase();
  const password = faker.internet.password();
  const num1 = faker.number.int({ min: 100, max: 999 });
  const num2 = faker.number.int({ min: 100, max: 999 });
  const image = `https://picsum.photos/${num1}/${num2}`;

  const response = await request.post("http://localhost:3000/api/users", {
    data: {
      user: {
        username,
        email,
        password,
        image,
      },
    },
  });

  if (!response.ok()) {
    throw new Error("User creation failed");
  }

  return { email, username, password, image };
}

export async function getUserViaAPI(request: APIRequestContext, token: string) {
  const response = await request.get("http://localhost:3000/api/user", {
    headers: { Authorization: `Token ${token}` },
  });

  expect(response.ok()).toBeTruthy();

  const { user } = await response.json();
  return user as {
    email: string;
    username: string;
    bio: string | null;
    image: string | null;
    token: string;
  };
}

export interface UpdatedUserData {
  editedUserName: string;
  editedBio: string;
  editedEmail: string;
  editedImage: string[];
}

export async function updateUserViaAPI(
  request: APIRequestContext,
  token: string,
  {
    editedUserName = faker.person.firstName().toLowerCase() +
      faker.person.lastName().toLowerCase(),
    editedBio = faker.person.bio(),
    editedEmail = `edited_${faker.internet.email()}`,
    editedImage = `https://picsum.photos/${faker.number.int({
      min: 100,
      max: 999,
    })}/${faker.number.int({ min: 100, max: 999 })}`,
    password = "default_password_123",
  } = {},
) {
  const response = await request.put("http://localhost:3000/api/user", {
    data: {
      user: {
        username: editedUserName,
        bio: editedBio,
        email: editedEmail,
        image: editedImage,
        password,
      },
    },
    headers: { Authorization: `Token ${token}` },
  });

  expect(response.ok()).toBeTruthy();

  const { user } = await response.json();
  return user;
}

export async function loginApi(
  request: APIRequestContext,
  email: string,
  password: string,
) {
  const loginResp = await request.post(
    "http://localhost:3000/api/users/login",
    {
      data: {
        user: { email, password },
      },
    },
  );

  const loginBody = await loginResp.json();
  return loginBody.user.token as string;
}

export async function loginUi(
  page: Page,
  {
    email,
    username,
    token,
  }: {
    email: string;
    username: string;
    token: string;
  },
) {
  await page.goto("http://localhost:3000/#");

  await page.evaluate(
    ({ email, username, token }) => {
      const loggedUser = {
        headers: {
          Authorization: `Token ${token}`,
        },
        isAuth: true,
        loggedUser: {
          email,
          username,
          bio: null,
          image: null,
          token,
        },
      };

      localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
    },
    { email, username, token },
  );

  await page.reload();
}

export async function createAndLoginUser(
  request: APIRequestContext,
  page: Page,
) {
  const { email, username, password } = await createUser(request);
  const token = await loginApi(request, email, password);
  await loginUi(page, { email, username, token });

  return { email, username, password, token };
}

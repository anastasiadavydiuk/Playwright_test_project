import { fakerDE as faker } from "@faker-js/faker";

export type ArticleData = {
  title: string;
  description: string;
  body: string;
};

export function generateArticleData(): ArticleData {
  return {
    title: faker.lorem.words({ min: 2, max: 5 }),
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraphs({ min: 1, max: 3 }),
  };
}

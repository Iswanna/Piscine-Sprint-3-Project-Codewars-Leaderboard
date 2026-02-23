import { test } from "node:test";
import { fetchUser, sanitizeInput } from "./api.mjs";
import nock from "nock";
import { expect } from "chai";

test("should return a success object when the API returns a 200", async () => {
  nock("https://www.codewars.com")
    .get("/api/v1/users/testuser")
    .reply(200, { username: "testuser", clan: "CodeYourFuture" });

  const result = await fetchUser("testuser");

  expect(result.success).to.be.true;
  expect(result.data.username).to.equal("testuser");
  expect(result.error).to.be.undefined;

  nock.cleanAll();
});

test("should return a failure object when the user does not exist (404)", async () => {
  nock("https://www.codewars.com").get("/api/v1/users/fakeuser").reply(404);

  const result = await fetchUser("fakeuser");

  expect(result.success).to.be.false;
  expect(result.error).to.equal("User not found");

  nock.cleanAll();
});

test("should return a failure object on network error", async () => {
  nock("https://www.codewars.com")
    .get("/api/v1/users/networkuser")
    .replyWithError("Network failure");

  const result = await fetchUser("networkuser");

  expect(result.success).to.be.false;
  expect(result.error).to.equal("Network error");

  nock.cleanAll();
});

test("should handle extra spaces and empty entries", () => {
  const input = " g964 ,  , jhoffner ";
  const expected = ["g964", "jhoffner"];
  expect(sanitizeInput(input)).to.deep.equal(expected);
});

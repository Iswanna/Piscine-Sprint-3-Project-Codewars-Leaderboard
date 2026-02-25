import { test } from "node:test";
import { fetchUser, sanitizeInput, processLeaderboardData } from "./api.mjs";
import nock from "nock";
import { expect } from "chai";

// Helper to clean up mocks after each API test
const cleanup = () => nock.cleanAll();

// Mock data for leaderboard logic tests
const mockUsers = [
  {
    username: "UserA",
    clan: "ClanA",
    ranks: {
      overall: { score: 100 },
      languages: { javascript: { score: 10 } },
    },
  },
  {
    username: "UserB",
    clan: "ClanB",
    ranks: {
      overall: { score: 500 },
      languages: { javascript: { score: 5 } },
    },
  },
];

// --- API FETCH TESTS ---

test("fetchUser should return a success object when the API returns a 200", async () => {
  nock("https://www.codewars.com")
    .get("/api/v1/users/testuser")
    .reply(200, { username: "testuser", clan: "CodeYourFuture" });

  const result = await fetchUser("testuser");

  expect(result.success).to.be.true;
  expect(result.data.username).to.equal("testuser");

  cleanup();
});

test("fetchUser should return a failure object when the user does not exist (404)", async () => {
  nock("https://www.codewars.com").get("/api/v1/users/fakeuser").reply(404);

  const result = await fetchUser("fakeuser");

  expect(result.success).to.be.false;
  expect(result.error).to.equal("User not found");

  cleanup();
});

test("fetchUser should return a failure object on network error", async () => {
  nock("https://www.codewars.com")
    .get("/api/v1/users/networkuser")
    .replyWithError("Network failure");

  const result = await fetchUser("networkuser");

  expect(result.success).to.be.false;
  expect(result.error).to.equal("Network error");

  cleanup();
});

// --- INPUT SANITIZATION TEST ---

test("sanitizeInput should handle extra spaces and empty entries", () => {
  const input = " g964 ,  , jhoffner ";
  const expected = ["g964", "jhoffner"];
  expect(sanitizeInput(input)).to.deep.equal(expected);
});

// --- LEADERBOARD LOGIC TESTS (Non-Trivial) ---

test("processLeaderboardData should sort users by overall score in descending order", () => {
  const result = processLeaderboardData(mockUsers, "overall");

  // UserB has 500, UserA has 100. UserB should be first.
  expect(result[0].username).to.equal("UserB");
  expect(result[1].username).to.equal("UserA");
});

test("processLeaderboardData should filter out users who do not have the selected language", () => {
  const usersWithOneNovice = [
    ...mockUsers,
    { username: "Novice", ranks: { overall: { score: 1 }, languages: {} } },
  ];

  const result = processLeaderboardData(usersWithOneNovice, "javascript");

  // 'Novice' should be hidden, result length should be 2
  expect(result).to.have.lengthOf(2);
  expect(result.map((user) => user.username)).to.not.contain("Novice");
});

test("processLeaderboardData should correctly switch scores when a language is selected", () => {
  const result = processLeaderboardData(mockUsers, "javascript");

  // In JS, UserA (score: 10) is higher than UserB (score: 5). UserA should be first.
  expect(result[0].username).to.equal("UserA");
  expect(result[0].score).to.equal(10);
});

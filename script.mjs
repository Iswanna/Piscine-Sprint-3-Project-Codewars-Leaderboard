import { fetchAllUsers } from "./api.mjs";

const form = document.querySelector("#user-form");
const input = document.querySelector("#username-input");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Clean the input: split by comma, remove spaces, ignore empty strings
  const usernames = input.value
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name !== "");

  if (usernames.length === 0) {
    alert("Please enter at least one username");
    return;
  }

  try {
    const results = await fetchAllUsers(usernames);

    // Filter results into two groups
    const validUsers = results.filter((r) => r.success).map((r) => r.data);
    const failedUsers = results.filter((r) => !r.success);

    // This is the "Verification" for Ticket 3
    console.log("Successfully fetched:", validUsers);
    console.log("Failed to fetch:", failedUsers);
  } catch (globalError) {
    console.error("An unexpected error occurred:", globalError);
  }
});

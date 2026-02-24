import { fetchAllUsers, sanitizeInput, getUniqueLanguages } from "./api.mjs";

const form = document.querySelector("#user-form");
const input = document.querySelector("#username-input");
const messageContainer = document.querySelector("#message-container");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  messageContainer.innerHTML = ""; // Clear UI

  const usernames = sanitizeInput(input.value);

  // Better empty input handling
  if (usernames.length === 0) {
    renderGeneralError("Please enter at least one username.");
    return;
  }

  try {
    const results = await fetchAllUsers(usernames);

    const validUsers = results
      .filter((result) => result.success)
      .map((res) => res.data);
    const failedUsers = results.filter((result) => !result.success);

    if (validUsers.length > 0) {
      // Get the languages from the users
      const languages = getUniqueLanguages(validUsers);

      // Setup the dropdown
      setupDropdown(languages);

      // Initial render (Default: Overall)
      renderLeaderboard(validUsers, "overall");
    }

    // Check if ALL users failed with network errors
    const networkErrors = failedUsers.filter(
      (failedUser) => failedUser.error === "Network error",
    );

    if (networkErrors.length > 0 && networkErrors.length === usernames.length) {
      renderGeneralError(
        "Something went wrong. Please check your internet connection.",
      );
      return;
    }

    if (failedUsers.length > 0) {
      renderErrors(failedUsers);
    }
  } catch (globalError) {
    // Safety net for network/unexpected errors
    renderGeneralError(
      "Something went wrong. Please check your internet connection.",
    );
  }
});

function renderErrors(failedUsers) {
  const userList = failedUsers.map((user) => `"${user.username}"`).join(", ");
  const errorPara = document.createElement("p");
  errorPara.className = "error-message";
  errorPara.textContent = `The following users could not be found: ${userList}`;
  messageContainer.appendChild(errorPara);
}

function renderGeneralError(message) {
  const errorPara = document.createElement("p");
  errorPara.className = "error-message";
  errorPara.textContent = message;
  messageContainer.appendChild(errorPara);
}

import { fetchAllUsers, sanitizeInput } from "./api.mjs";

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
    const failedUsers = results.filter((r) => !r.success);

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
  const userList = failedUsers.map((u) => `"${u.username}"`).join(", ");
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

import { fetchAllUsers } from "./api.mjs";

const form = document.querySelector("#user-form");
const input = document.querySelector("#username-input");
const messageContainer = document.querySelector("#message-container");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  messageContainer.innerHTML = ""; // Clear UI

  const usernames = input.value.split(",").map(n => n.trim()).filter(n => n !== "");
  if (usernames.length === 0) return;

  const results = await fetchAllUsers(usernames);
  const failedUsers = results.filter((r) => !r.success);

  if (failedUsers.length > 0) {
    renderErrors(failedUsers);
  }
});

function renderErrors(failedUsers) {
  const userList = failedUsers.map(u => `"${u.username}"`).join(", ");
  const errorPara = document.createElement("p");
  errorPara.className = "error-message";
  errorPara.textContent = `The following users could not be found: ${userList}`;
  messageContainer.appendChild(errorPara);
}
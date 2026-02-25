import {
  fetchAllUsers,
  sanitizeInput,
  getUniqueLanguages,
  processLeaderboardData,
} from "./api.mjs";

// Central State: Keeps track of current data so we don't have to re-fetch
const appState = {
  userList: [],
  selectedLanguage: "overall",
};

// Select HTML elements
const leaderboardForm = document.querySelector("#user-form");
const usernameInput = document.querySelector("#username-input");
const feedbackMessageContainer = document.querySelector("#message-container");
const languageSelector = document.querySelector("#language-select");

// NEW: Select containers to show/hide for accessibility
const filterContainer = document.querySelector("#filter-container");
const leaderboardTable = document.querySelector("#leaderboard");

leaderboardForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Stop page from refreshing
  feedbackMessageContainer.innerHTML = ""; // Clear old error messages

  const sanitizedUsernames = sanitizeInput(usernameInput.value);

  // If input is empty, show a message and stop the process
  if (sanitizedUsernames.length === 0) {
    displayGeneralError("Please enter at least one username.");
    return;
  }

  try {
    const fetchResults = await fetchAllUsers(sanitizedUsernames);

    // Separate results into "Successful" and "Failed" groups
    const successfullyFetchedUsers = [];
    const failedFetchRecords = [];

    fetchResults.forEach((fetchResult) => {
      if (fetchResult.success === true) {
        successfullyFetchedUsers.push(fetchResult.data);
      } else {
        failedFetchRecords.push(fetchResult);
      }
    });

    // 1. If we retrieved valid users, update the global state and UI
    if (successfullyFetchedUsers.length > 0) {
      appState.userList = successfullyFetchedUsers;
      appState.selectedLanguage = "overall";

      // FIX: Reveal the table and filter now that data exists
      // This prevents Lighthouse from seeing "empty" table headers on page load
      filterContainer.classList.remove("hidden");
      leaderboardTable.classList.remove("hidden");

      const availableLanguages = getUniqueLanguages(appState.userList);
      populateLanguageDropdown(availableLanguages);
      renderLeaderboardTable();
    } else {
      // Optional: Hide the table if a new search results in 0 valid users
      filterContainer.classList.add("hidden");
      leaderboardTable.classList.add("hidden");
    }

    // 2. Handle specific errors for users not found or network issues
    if (failedFetchRecords.length > 0) {
      // Check if EVERY search failed because of a connectivity problem
      const isTotalNetworkFailure =
        failedFetchRecords.length === sanitizedUsernames.length &&
        failedFetchRecords[0].error === "Network error";

      if (isTotalNetworkFailure) {
        displayGeneralError(
          "Something went wrong. Please check your internet connection.",
        );
      } else {
        // Just show which specific usernames were not found
        displayInvalidUserErrors(failedFetchRecords);
      }
    }
  } catch (unexpectedError) {
    displayGeneralError("An unexpected error occurred. Please try again.");
  }
});

// Update the table whenever the user picks a different language
languageSelector.addEventListener("change", (event) => {
  appState.selectedLanguage = event.target.value;
  renderLeaderboardTable();
});

// --- UI Helper Functions ---

function populateLanguageDropdown(languagesList) {
  // Clear the dropdown but keep the 'Overall' option at the top
  languageSelector.innerHTML = '<option value="overall">Overall</option>';

  languagesList.forEach((languageName) => {
    const dropdownOption = document.createElement("option");
    dropdownOption.value = languageName;

    // Capitalize for display (e.g., "python" becomes "Python")
    const capitalizedLanguageName =
      languageName.charAt(0).toUpperCase() + languageName.slice(1);
    dropdownOption.textContent = capitalizedLanguageName;

    languageSelector.appendChild(dropdownOption);
  });
}

function renderLeaderboardTable() {
  const tableBody = document.querySelector("#leaderboard-body");
  const rowTemplate = document.querySelector("#user-row-template");
  tableBody.innerHTML = ""; // Empty the table before drawing new rows

  // Step 1: Get the filtered and sorted data from our tested logic function
  const usersMatchingCriteria = processLeaderboardData(
    appState.userList,
    appState.selectedLanguage,
  );

  // Step 2: Create the HTML rows and add them to the table
  usersMatchingCriteria.forEach((displayUser, userRankIndex) => {
    const templateContent = rowTemplate.content.cloneNode(true);
    const tableRow = templateContent.querySelector("tr");

    tableRow.querySelector(".td-username").textContent = displayUser.username;
    tableRow.querySelector(".td-clan").textContent = displayUser.clan;
    tableRow.querySelector(".td-score").textContent = displayUser.score;

    // The person at index 0 is the winner
    if (userRankIndex === 0) {
      tableRow.classList.add("winner-highlight");
    }

    tableBody.appendChild(templateContent);
  });
}

function displayInvalidUserErrors(failedUserRecords) {
  const wrongName = failedUserRecords
    .map((failedUser) => `"${failedUser.username}"`)
    .join(", ");

  const errorMessageParagraph = document.createElement("p");
  errorMessageParagraph.className = "error-message";
  errorMessageParagraph.textContent = `The following users could not be found: ${wrongName}`;
  feedbackMessageContainer.appendChild(errorMessageParagraph);
}

function displayGeneralError(messageText) {
  const errorMessageParagraph = document.createElement("p");
  errorMessageParagraph.className = "error-message";
  errorMessageParagraph.textContent = messageText;
  feedbackMessageContainer.appendChild(errorMessageParagraph);
}

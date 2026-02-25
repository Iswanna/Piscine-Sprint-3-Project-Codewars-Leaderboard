const BASE_URL = "https://www.codewars.com/api/v1/users/";

export async function fetchUser(username) {
  try {
    const response = await fetch(`${BASE_URL}${username}`);

    if (!response.ok) {
      // If 404 or other error, we return a "failure" object
      return {
        success: false,
        username,
        error: response.status === 404 ? "User not found" : "API Error",
      };
    }

    const data = await response.json();
    // On success, we return a "success" object with the data
    return { success: true, username, data };
  } catch (err) {
    // This catches network/offline errors
    return { success: false, username, error: "Network error" };
  }
}

export async function fetchAllUsers(usernames) {
  const promises = usernames.map((name) => fetchUser(name));
  return await Promise.all(promises);
}

export function sanitizeInput(inputString) {
  return inputString
    .split(",")
    .map((n) => n.trim())
    .filter((n) => n !== "");
}

/**
 * Scans all fetched users to find every unique language they have a rank in.
 */
export function getUniqueLanguages(users) {
  const languages = new Set();

  users.forEach((user) => {
    // Codewars stores languages inside user.ranks.languages
    if (user.ranks && user.ranks.languages) {
      Object.keys(user.ranks.languages).forEach((lang) => {
        languages.add(lang);
      });
    }
  });

  // Return as an array, sorted alphabetically
  return Array.from(languages).sort();
}

/**
 * Processes raw user data into a sorted list based on a selected language.
 * This is a "Non-Trivial" logic function.
 */
export function processLeaderboardData(users, selectedLanguage) {
  const processedList = [];

  users.forEach((user) => {
    let score;

    if (selectedLanguage === "overall") {
      score = user.ranks.overall.score;
    } else {
      const languageInfo = user.ranks.languages[selectedLanguage];
      if (languageInfo) {
        score = languageInfo.score;
      }
    }

    if (score !== undefined) {
      processedList.push({
        username: user.username,
        clan: user.clan || "No Clan",
        score: score,
      });
    }
  });

  // Sort from highest score to lowest
  processedList.sort((firstUser, secondUser) => {
    return secondUser.score - firstUser.score;
  });

  return processedList;
}

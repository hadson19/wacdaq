export const API_URL =
  window.location.hostname === "wacdaq.pro"
    ? "https://api.wacdaq.pro"
    : "https://testapi.wacdaq.pro";

export const language = [
  { id: 1, shortname: "en", longname: "english", iconpath: "en_icon.png" },
  { id: 2, shortname: "cn", longname: "chinese", iconpath: "ch_icon.png" }
];

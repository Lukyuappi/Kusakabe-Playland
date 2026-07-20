const SEARCH_ITEMS = [
  {
    title: "ホーム",
    url: "index.html",
    keywords: ["ホーム"]
  },
  {
    title: "歴史",
    url: "history.html",
    keywords: ["歴史"]
  },
  {
    title: "アトラクション",
    url: "attractions.html",
    keywords: ["アトラクション"]
  },
  {
    title: "チケット",
    url: "tickets.html",
    keywords: ["チケット"]
  },
  {
    title: "アクセス",
    url: "access.html",
    keywords: ["アクセス"]
  },
  {
    title: "お知らせ",
    url: "news.html",
    keywords: ["お知らせ"]
  },
  {
    title: "くさぴょんコースターに関するニュース",
    url: "attraction/coasternews.html",
    keywords: ["くさぴょんコースター"]
  },
  {
    title: "くさかべ観覧車のうわさ",
    url: "attraction/ferrismagazine.html",
    keywords: ["くさかべ観覧車"]
  },
  {
    title: "くさぴょんといっしょ！パレード",
    url: "attraction/parade.html",
    keywords: ["くさぴょんといっしょ！パレード"]
  }

  ,{
    title: "創設者",
    url: "founder.html",
    keywords: ["そういちろうくん", "くさかべそういちろう", "日下部創一郎"]
  },
  ,{
    title: "くさぴょんフレンズ",
    url: "kusapyon.html",
    keywords: ["くさぴょんフレンズ"]
  },
  
  {
    title: "旧ページ",
    url: "oldsite/index_old.html",
    keywords: ["日下部遊園地","旧ページ"]
  },
  
  {
    title: "日下部創也の日記１",
    url: "diary/diary1.html",
    keywords: ["HighCoaster"]
  },
  {
    title: "日下部創也の日記２",
    url: "diary/diary2.html",
    keywords: ["土喰様"]
  },
  {
    title: "日下部創也の日記３",
    url: "diary/diary3.html",
    keywords: ["あ"]
  },
];

function normalizeText(text) {
  return String(text)
    .toLowerCase()
    .replace(/[\s\u3000\-_/【】（）()]/g, "");
}

function getSearchScriptUrl() {
  const currentScript = document.currentScript;
  if (currentScript && currentScript.src) {
    return currentScript.src;
  }

  const scriptTag = Array.from(document.scripts).find((script) => script.src.includes("search.js"));
  return scriptTag ? scriptTag.src : "";
}

function getSiteRootUrl() {
  const scriptUrl = getSearchScriptUrl();
  if (!scriptUrl) {
    return new URL("./", window.location.href);
  }

  return new URL("../", scriptUrl);
}

function resolveSiteUrl(path) {
  return new URL(path.replace(/^\/+/, ""), getSiteRootUrl()).toString();
}

function ensureSearchResults() {
  const input = document.getElementById("secretInput");
  if (!input) {
    return;
  }

  let results = document.getElementById("searchResults");
  if (!results) {
    results = document.createElement("div");
    results.id = "searchResults";
    results.className = "search-results";
    input.parentNode.appendChild(results);
  }

  return results;
}

function renderResults(items) {
  const results = ensureSearchResults();
  if (!results) {
    return;
  }

  if (!items.length) {
    results.innerHTML = '<p class="search-empty">該当するページはありませんでした。</p>';
    return;
  }

  const listItems = items
    .map((item) => {
      return `<li><a href="${item.url}" data-search-url="${item.url}">${item.title}</a><span>${item.keywords.join(" / ")}</span></li>`;
    })
    .join("");

  results.innerHTML = `<ul class="search-result-list">${listItems}</ul>`;

  results.querySelectorAll("a[data-search-url]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = resolveSiteUrl(link.getAttribute("data-search-url"));
    });
  });
}

function checkKeyword() {
  const input = document.getElementById("secretInput");
  if (!input) {
    return;
  }

  const query = input.value.trim();
  if (!query) {
    renderResults([]);
    return;
  }

  const normalizedQuery = normalizeText(query);
  const matches = SEARCH_ITEMS.filter((item) => {
    return item.keywords.some((keyword) => normalizeText(keyword).includes(normalizedQuery));
  });

  if (matches.length === 1) {
    window.location.href = resolveSiteUrl(matches[0].url);
    return;
  }

  renderResults(matches);
}

function initSearch() {
  const input = document.getElementById("secretInput");
  if (!input) {
    return;
  }

  ensureSearchResults();

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      checkKeyword();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSearch);
} else {
  initSearch();
}

window.checkKeyword = checkKeyword;


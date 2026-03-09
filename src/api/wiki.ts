export async function fetchWikipediaSummary(city: string, country: string) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      `${city} ${country}`
    )}&format=json&origin=*`;

    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) return null;

    const searchData = await searchRes.json();
    const results = searchData?.query?.search ?? [];
    if (!results.length) return null;

    const lowerCity = city.toLowerCase();

    // Score each result
    const scored = results.map((r: any) => {
      const title = r.title.toLowerCase();
      const snippet = r.snippet.toLowerCase();

      let score = 0;

      // 1. Exact title match
      if (title === lowerCity) score += 100;

      // 2. Title starts with city name
      if (title.startsWith(lowerCity)) score += 40;

      // 3. Title contains city name
      if (title.includes(lowerCity)) score += 20;

      // 4. Prefer city-like pages
      if (/city|capital|metropolitan|urban|municipality/.test(snippet)) {
        score += 30;
      }

      // 5. Prefer US city pages like "El Paso, Texas"
      if (/, [A-Z][a-z]+$/.test(r.title)) score += 50;

      // 6. Avoid disambiguation pages
      if (/disambiguation/.test(title)) score -= 100;

      // 7. Avoid county pages
      if (/county/.test(title)) score -= 40;

      // 8. Avoid transit/harbor/etc.
      if (/harbor|transit|rail|airport|station/.test(title)) score -= 30;

      return { ...r, score };
    });

    // Pick the highest scoring result
    const best = scored.sort((a, b) => b.score - a.score)[0];
    if (!best) return null;

    const title = best.title.replace(/ /g, "_");

    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      title
    )}`;

    const summaryRes = await fetch(summaryUrl);
    if (!summaryRes.ok) return null;

    const summaryData = await summaryRes.json();
    return summaryData;
  } catch {
    return null;
  }
}
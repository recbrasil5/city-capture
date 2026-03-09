export async function fetchWikipediaSummary(city: string, country: string) {
  try {
    // 1. Search for the correct page
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      `${city} ${country}`
    )}&format=json&origin=*`;

    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) return null;

    const searchData = await searchRes.json();
    const first = searchData?.query?.search?.[0];
    if (!first) return null;

    const title = first.title.replace(/ /g, "_");

    // 2. Fetch the summary for the resolved title
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      title
    )}`;

    const summaryRes = await fetch(summaryUrl);
    if (!summaryRes.ok) return null;

    const summaryData = await summaryRes.json();
    return summaryData.extract || null;
  } catch {
    return null;
  }
}
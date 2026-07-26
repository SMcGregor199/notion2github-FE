function getSeries(post) {
  const series = post?.series;
  return series
    && typeof series.name === "string" && series.name.trim()
    && typeof series.slug === "string" && series.slug.trim()
    ? series
    : null;
}

function isPublicPost(post) {
  // Runtime blog data already contains only published posts. The explicit
  // check also keeps this utility safe for previews and future callers that
  // include draft-shaped records.
  return post?.published !== false;
}

function compareByPublicationDate(left, right) {
  const leftTime = Date.parse(left?.publishedDate || "");
  const rightTime = Date.parse(right?.publishedDate || "");
  const normalizedLeft = Number.isNaN(leftTime) ? Number.MAX_SAFE_INTEGER : leftTime;
  const normalizedRight = Number.isNaN(rightTime) ? Number.MAX_SAFE_INTEGER : rightTime;
  if (normalizedLeft !== normalizedRight) return normalizedLeft - normalizedRight;
  return String(left?.link || left?.title || "").localeCompare(String(right?.link || right?.title || ""));
}

export function getSeriesMembers(posts, seriesSlug) {
  if (!Array.isArray(posts) || typeof seriesSlug !== "string" || !seriesSlug.trim()) {
    return [];
  }

  return posts
    .filter((post) => isPublicPost(post) && getSeries(post)?.slug === seriesSlug)
    .sort(compareByPublicationDate);
}

export function getSeriesNavigation(posts, post) {
  const series = getSeries(post);
  if (!series) return null;

  const members = getSeriesMembers(posts, series.slug);
  const index = members.findIndex((member) => member?.id === post?.id || member?.link === post?.link);
  if (index < 0) return null;

  return {
    series,
    members,
    position: index + 1,
    previous: index > 0 ? members[index - 1] : null,
    next: index < members.length - 1 ? members[index + 1] : null,
  };
}

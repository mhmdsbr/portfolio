export function projectSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Slugifies a name and appends -2, -3, ... until it is not in `taken`. */
export function uniqueSlug(
  value: string,
  taken: ReadonlySet<string>,
  fallback: string,
): string {
  const base = projectSlug(value) || fallback;
  if (!taken.has(base)) return base;
  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

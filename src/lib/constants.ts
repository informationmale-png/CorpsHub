// Shared option sets used across forms, filters, and the library.

export const SECTORS = [
  "Food Security",
  "Housing",
  "Veterans",
  "Education",
  "Public Health",
  "Mental Health",
  "Workforce",
  "Immigration",
  "Legal Aid",
  "Youth Development",
  "Seniors & Aging",
  "Disability Services",
  "Environment",
  "Disaster Relief",
  "Animal Welfare",
  "Civic & Government",
  "Faith-Based",
  "Arts",
] as const;

// Shown in the submit form's sector picker. "Other" reveals a free-text field so
// fellows can name a sector we haven't listed; the typed value is stored as-is and
// is searchable (typing it in search finds it and similar ones).
export const OTHER_SECTOR = "Other";
export const SECTOR_OPTIONS = [...SECTORS, OTHER_SECTOR] as const;

export const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"] as const;

export const SETUP_TIMES = ["Under 1 day", "1-3 days", "1 week+"] as const;

export const ORG_SIZES = ["Small", "Medium", "Large"] as const;

export type Sector = (typeof SECTORS)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];

// URL-safe slug <-> label for sector library pages.
export const sectorSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const sectorFromSlug = (slug: string) => SECTORS.find((s) => sectorSlug(s) === slug);

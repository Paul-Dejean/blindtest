/**
 * Mapping of iTunes genre names to their numeric IDs
 * Used for the genreIndex parameter in iTunes Search API
 */
export const ITUNES_GENRES = {
  ALL: -1,
  ALTERNATIVE: 20,
  ANIME: 29,
  BLUES: 2,
  CHILDRENS_MUSIC: 4,
  CLASSICAL: 5,
  COMEDY: 3,
  COUNTRY: 6,
  DANCE: 17,
  DISNEY: 50,
  EASY_LISTENING: 25,
  ELECTRONIC: 7,
  ENKA: 28,
  FRENCH_POP: 50000063,
  GERMAN_FOLK: 50000068,
  GERMAN_POP: 50000066,
  HIP_HOP_RAP: 18,
  HOLIDAY: 8,
  INDIE_POP: 1046,
  INDUSTRIAL: 19,
  INSPIRATIONAL: 22,
  INSTRUMENTAL: 53,
  J_POP: 27,
  JAZZ: 11,
  K_POP: 51,
  KARAOKE: 52,
  LATIN: 12,
  METAL: 1153,
  NEW_AGE: 13,
  OPERA: 9,
  POP: 14,
  R_AND_B_SOUL: 15,
  REGGAE: 24,
  ROCK: 21,
  SINGER_SONGWRITER: 10,
  SOUNDTRACK: 16,
  SPOKEN_WORD: 50000061,
  VOCAL: 23,
  WORLD: 19,
};

/**
 * Mapping of human-readable genre names to iTunes genre IDs
 * For use in UI display
 */
export const GENRE_DISPLAY_NAMES: Record<string, string> = {
  ALL: 'All Genres',
  ALTERNATIVE: 'Alternative',
  ANIME: 'Anime',
  BLUES: 'Blues',
  CHILDRENS_MUSIC: "Children's Music",
  CLASSICAL: 'Classical',
  COMEDY: 'Comedy',
  COUNTRY: 'Country',
  DANCE: 'Dance',
  DISNEY: 'Disney',
  EASY_LISTENING: 'Easy Listening',
  ELECTRONIC: 'Electronic',
  ENKA: 'Enka',
  FRENCH_POP: 'French Pop',
  GERMAN_FOLK: 'German Folk',
  GERMAN_POP: 'German Pop',
  HIP_HOP_RAP: 'Hip-Hop/Rap',
  HOLIDAY: 'Holiday',
  INDIE_POP: 'Indie Pop',
  INDUSTRIAL: 'Industrial',
  INSPIRATIONAL: 'Inspirational',
  INSTRUMENTAL: 'Instrumental',
  J_POP: 'J-Pop',
  JAZZ: 'Jazz',
  K_POP: 'K-Pop',
  KARAOKE: 'Karaoke',
  LATIN: 'Latin',
  METAL: 'Metal',
  NEW_AGE: 'New Age',
  OPERA: 'Opera',
  POP: 'Pop',
  R_AND_B_SOUL: 'R&B/Soul',
  REGGAE: 'Reggae',
  ROCK: 'Rock',
  SINGER_SONGWRITER: 'Singer/Songwriter',
  SOUNDTRACK: 'Soundtrack',
  SPOKEN_WORD: 'Spoken Word',
  VOCAL: 'Vocal',
  WORLD: 'World',
};

/**
 * Get iTunes genre ID from genre key
 * @param genre Genre key (uppercase with underscores)
 * @returns iTunes genre ID or -1 for ALL
 */
export function getGenreId(genre: string): number {
  const genreKey = genre.toUpperCase().replace(/ /g, '_') as keyof typeof ITUNES_GENRES;
  return ITUNES_GENRES[genreKey] || ITUNES_GENRES.ALL;
}

/**
 * Get display name for a genre key
 * @param genre Genre key (uppercase with underscores)
 * @returns Human-readable genre name
 */
export function getGenreDisplayName(genre: string): string {
  const genreKey = genre.toUpperCase().replace(/ /g, '_') as keyof typeof GENRE_DISPLAY_NAMES;
  return GENRE_DISPLAY_NAMES[genreKey] || 'All Genres';
}

/**
 * Get all available genres for UI display
 * @returns Array of objects with id, key, and name
 */
export function getAllGenres() {
  return Object.keys(ITUNES_GENRES).map((key) => ({
    id: ITUNES_GENRES[key as keyof typeof ITUNES_GENRES],
    key,
    name: GENRE_DISPLAY_NAMES[key as keyof typeof GENRE_DISPLAY_NAMES],
  }));
}

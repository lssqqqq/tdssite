/**
 * Display-name formatting for map files.
 *
 * Map file names such as "wretched_front.png" or "dark-fortress.webp" are turned into readable
 * names ("Wretched Front", "Dark Fortress") for the UI ONLY. Callers must keep using the original
 * file name / URL for loading images and for matching saved strategies.
 *
 *   formatMapName('wretched_front')            -> 'Wretched Front'
 *   formatMapName('winter_outpost.png')        -> 'Winter Outpost'
 *   formatMapName('the_ancient_ruins_v2')      -> 'The Ancient Ruins V2'
 *   formatMapName('dark-fortress')             -> 'Dark Fortress'
 *   formatMapName('/assets/maps/Badlands%20II.png') -> 'Badlands II'
 *   formatMapName('WRECKED_BATTLEFIELD')       -> 'Wrecked Battlefield'
 */

/** Image extensions that are stripped. Other dots (e.g. "v1.2") are part of the name and kept. */
const IMAGE_EXTENSION = /\.(png|jpe?g|webp|gif|avif|bmp|svg)$/i;

/** Characters that separate words in file names: underscores, hyphens, dashes, plus signs, tildes. */
const SEPARATORS = /[_\-\u2010-\u2015+~]+/g;

/** Roman numerals commonly found in map names ("Badlands II"); always shown upper-case. */
const ROMAN_NUMERAL = /^(ii|iii|iv|vi|vii|viii|ix)$/i;

const safeDecode = (s: string): string => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

/** Upper-cases only the first character of a word and leaves the rest as written. */
const upperFirst = (word: string): string => {
  const chars = Array.from(word);
  if (chars.length === 0) return word;
  return chars[0].toLocaleUpperCase('en') + chars.slice(1).join('');
};

/** Upper-case first letter, lower-case the rest ("BATTLEFIELD" -> "Battlefield"). */
const titleCase = (word: string): string => {
  const chars = Array.from(word);
  if (chars.length === 0) return word;
  return chars[0].toLocaleUpperCase('en') + chars.slice(1).join('').toLocaleLowerCase('en');
};

/**
 * Turns a map file name, file path/URL or raw map name into a readable display name.
 * - removes folders and (image) file extensions
 * - turns underscores, hyphens and similar separators into single spaces
 * - capitalises each word without damaging acronyms, numbers or roman numerals
 *   (an entirely UPPER-CASE name is converted to normal title case)
 * - never returns an empty string for non-empty input: it falls back to the trimmed original
 */
export const formatMapName = (input: string | null | undefined): string => {
  if (input == null) return '';
  const original = String(input).trim();
  if (!original) return '';

  // Keep only the last path segment, drop any query/hash, and undo URL encoding ("%20" -> " ").
  let name = safeDecode(original.split(/[?#]/)[0]);
  name = name.slice(Math.max(name.lastIndexOf('/'), name.lastIndexOf('\\')) + 1);
  name = name.replace(IMAGE_EXTENSION, '');

  // Separators -> spaces; collapse repeated whitespace.
  name = name.replace(SEPARATORS, ' ').replace(/\s+/g, ' ').trim();
  if (!name) return original;

  // An all-caps name ("WRECKED BATTLEFIELD") is shouted by the file name, not meaningful casing.
  const letters = name.replace(/[^\p{L}]/gu, '');
  const isAllCaps = letters.length > 0 && letters === letters.toLocaleUpperCase('en') && letters !== letters.toLocaleLowerCase('en');

  return name
    .split(' ')
    .map(word => {
      if (ROMAN_NUMERAL.test(word)) return word.toUpperCase();
      return isAllCaps ? titleCase(word) : upperFirst(word);
    })
    .join(' ');
};

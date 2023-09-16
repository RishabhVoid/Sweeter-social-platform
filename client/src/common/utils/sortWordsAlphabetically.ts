function sortWordsAlphabetically(words: string[]): string[] {
  const sortedWords = words.slice().sort((a, b) => a.localeCompare(b));
  return sortedWords;
}

export default sortWordsAlphabetically;

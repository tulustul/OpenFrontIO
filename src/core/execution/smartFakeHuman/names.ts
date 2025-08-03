export const COUNTRY_NAMES = [
  "Rome",
  "Egypt",
  "Greece",
  "China",
  "Japan",
  "England",
  "France",
  "Germany",
  "Russia",
  "Spain",
  "Persia",
  "Mongolia",
  "Byzantium",
  "Ottoman Empire",
  "Aztecs",
  "Vikings",
  "Arabia",
  "Babylon",
  "Assyria",
  "Maya",
  "Incas",
  "Carthage",
  "Phoenicia",
  "Holy Roman Empire",
  "Venice",
  "Poland",
  "Hungary",
  "Sweden",
  "Austria",
  "Prussia",
  "Denmark",
  "Norway",
  "India",
  "Turkey",
  "Korea",
  "Vietnam",
  "Thailand",
  "Indonesia",
  "Mali",
  "Ethiopia",
  "Morocco",
  "Sumeria",
  "Hittites",
  "Mycenae",
  "Franks",
  "Genoa",
  "Rus",
  "Olmecs",
  "Songhai",
  "Kush",
  "Axum",
  "Zimbabwe",
  "Nubia",
  "Visigoths",
  "Afghanistan",
  "Algeria",
  "Argentina",
  "Armenia",
  "Austria",
  "Azerbaijan",
  "Bangladesh",
  "Belgium",
  "Bhutan",
  "Bolivia",
  "Bosnia",
  "Botswana",
  "Brazil",
  "Bulgaria",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Congo",
  "Cuba",
  "Czech",
  "Denmark",
  "Egypt",
  "Estonia",
  "Ethiopia",
  "Finland",
  "France",
  "Georgia",
  "Germany",
  "Greece",
  "Grenada",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Soviet Union",
  "Yugoslavia",
  "Turkey",
  "Prussia",
  "Sardinia",
  "Bavaria",
  "Siam",
  "Tibet",
  "Sicily",
];

import { PseudoRandom } from "../../PseudoRandom";

/**
 * Selects n unique civilization names with weighted probability.
 * Names earlier in the list have higher probability of selection.
 */
export function selectNames(n: number, random: PseudoRandom): string[] {
  if (n <= 0) return [];
  if (n >= COUNTRY_NAMES.length) return [...COUNTRY_NAMES];

  const weightFlattening = COUNTRY_NAMES.length / 10;

  const names = [...COUNTRY_NAMES];
  const selected: string[] = [];

  // Calculate initial weights once
  const weights: number[] = [];
  let totalWeight = 0;

  for (let j = 0; j < names.length; j++) {
    const weight = names.length - j + weightFlattening;
    weights.push(weight);
    totalWeight += weight;
  }

  for (let i = 0; i < n; i++) {
    if (names.length === 0) break;

    // Select based on weighted probability
    const randomValue = random.nextFloat(0, totalWeight);
    let cumulativeWeight = 0;
    let selectedIndex = 0;

    for (let j = 0; j < weights.length; j++) {
      cumulativeWeight += weights[j];
      if (randomValue <= cumulativeWeight) {
        selectedIndex = j;
        break;
      }
    }

    // Add selected name and remove from available names
    selected.push(names[selectedIndex]);
    names.splice(selectedIndex, 1);

    // Update weights and total by removing the selected weight
    totalWeight -= weights[selectedIndex];
    weights.splice(selectedIndex, 1);
  }

  return selected;
}

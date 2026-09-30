import { expect, test } from "@jest/globals";
import { matchupsOf } from "./pokemonTypes";

const row = (types: string[], label: string) =>
  matchupsOf(types).find(([name]) => name === label)![1].map(([type, note]) => (note ? `${type} ${note}` : type));

// Charizard: flying cancels fire's ground and ice weaknesses (ground can't touch it at all), rock hits both.
test("a second type multiplies into the first", () => {
  expect(row(["fire", "flying"], "Weak to")).toEqual(["electric", "rock ×4", "water"]);
  expect(row(["fire", "flying"], "Resists")).toEqual(["bug ×¼", "fairy", "fighting", "fire", "grass ×¼", "ground ×0", "steel"]);
  expect(row(["ghost", "poison"], "Resists")).toEqual(["bug ×¼", "fairy", "fighting ×0", "grass", "normal ×0", "poison ×¼"]);
});

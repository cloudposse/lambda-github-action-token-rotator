import { stringHelpers } from "./stringHelpers";

describe("stringHelpers", () => {
  describe("toTitleCase", () => {
    const testCases = [
      ["one", "One"],
      ["two words", "Two Words"],
      ["CAPITALIZED", "Capitalized"],
    ];
    it.each(testCases)("given %p it returns %p", (testCase, expectedResult) => {
      const result = stringHelpers.toTitleCase(testCase);
      expect(result).toEqual(expectedResult);
    });
  });
});

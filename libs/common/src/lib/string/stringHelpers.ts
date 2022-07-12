const toTitleCase = (s) =>
  s.replace(
    /\w\S*/g,
    (t) => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase()
  );

export const stringHelpers = {
  toTitleCase,
};

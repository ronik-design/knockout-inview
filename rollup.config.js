import babel from "rollup-plugin-babel";

export default {
  entry: "lib/knockout-inview.js",
  plugins: [babel()],
  dest: "dist/knockout-inview.js",
  format: "cjs"
};

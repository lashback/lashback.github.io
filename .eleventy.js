const yaml = require("js-yaml");
const sass = require("sass");
const path = require("node:path");

module.exports = function (eleventyConfig) {
  // Eleventy reads .json / .js data files natively but NOT YAML — register it,
  // otherwise everything in src/_data/*.yaml is silently ignored.
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Compile SCSS -> CSS as part of the normal Eleventy build (no separate step).
  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    compile: function (inputContent, inputPath) {
      const parsed = path.parse(inputPath);
      if (parsed.name.startsWith("_")) return; // skip partials
      const result = sass.compileString(inputContent, {
        loadPaths: [parsed.dir || "."],
        style: "compressed",
      });
      return () => result.css;
    },
  });

  // Static assets (résumé PDF, images) copied straight through.
  eleventyConfig.addPassthroughCopy({ "src/static": "static" });

  eleventyConfig.addShortcode("year", () => new Date().getFullYear());

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",

    // Project repo (username.github.io/portfolio)? Uncomment and set to "/portfolio/".
    // pathPrefix: "/portfolio/",
  };
};

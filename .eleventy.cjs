const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPassthroughCopy('src/docs/docs.css');
  eleventyConfig.addPassthroughCopy('src/docs/.nojekyll');
  eleventyConfig.addPassthroughCopy(
    'node_modules/@webcomponents/webcomponentsjs'
  );
  eleventyConfig.addPassthroughCopy('node_modules/lit/polyfill-support.js');
  return {
    dir: {
      input: 'src/docs',
      output: 'docs/',
    },
    templateExtensionAliases: {
      '11ty.cjs': '11ty.js',
      '11tydata.cjs': '11tydata.js',
    },
  };
};

const { override } = require('customize-cra')

var overridePostCss = (config) => {
    filterPostCSSLoader(config.module.rules).forEach(rule => {
      filterPostCSSLoader(rule.oneOf).forEach(oneOf => {
        filterPostCSSLoader(oneOf.use || oneOf.loader).forEach(use => {
          use.loader = require.resolve('postcss-loader');

        });
      });
    }); 
  
    return config;
  }; 
  
  const filterPostCSSLoader = array => array.filter(object => JSON.stringify(object).includes('postcss-loader'));

const overrideEntry = (config) => {
    config.entry = {
      main: './src/content', // the extension UI
      background: './src/background',
    }
  
    return config
  }

const overrideOutput = (config) => {
    config.output = {
        ...config.output,
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].js',
    }

    return config
}

module.exports = {
    webpack: (config) => override(overrideEntry, overrideOutput, overridePostCss)(config),
}
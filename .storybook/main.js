module.exports = {
  stories: [
    '../src/**/*.stories.mdx',
    '../pages/**/*.stories.@(js|jsx|ts|tsx)',

    '../src/**/*.stories.@(js|jsx|ts|tsx)',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-addon-apollo-client',
    'storybook-dark-mode',
    'storybook-addon-next',
    '@storybook/addon-a11y',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
};
import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {
      jsxRuntime: "automatic",
    },
  },
  docs: {
    autodocs: "tag",
  },
  async viteFinal(config) {
    // Merge custom configuration into the default config
    return mergeConfig(config, {
      lightningcss: {
        drafts: {
          nesting: true,
          customMedia: true,
        },
        modules: true,
      },
      css: {
        modules: true,
      },
      define: {
        "process.env.__DEV__": "false",
        "process.env.NODE_ENV": JSON.stringify("development"),
      },
    });
  },
};
export default config;

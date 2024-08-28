import { createStore, StoreProvider } from "@brevity-builder/react";
import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => {
      console.log("Decorating story");
      const useStore = createStore({});
      return (
        <div style={{ margin: "32px" }}>
          <link
            rel="stylesheet"
            href="https://staging.brevity.io/api/v1/code/org_27kgBQ65xoatIHxBg5EL0gfjigx/mp1epttdz1hgqcwe8rx52/dev/theme"
          />
          <StoreProvider store={useStore}>
            <Story />
          </StoreProvider>
        </div>
      );
    },
  ],
};

export default preview;

import type { Meta, StoryObj } from "@storybook/react";

import { BlockNote } from ".";

const meta: Meta<typeof BlockNote> = {
  title: "Example/BlockNote",
  component: BlockNote,
};

type Story = StoryObj<typeof BlockNote>;

export const Primary: Story = {
  render: () => (
    <BlockNote
      defaultValue="<h1>Hello, world!</h1>"
      onTextChange={(text) => console.log(text)}
    />
  ),
};

export default meta;

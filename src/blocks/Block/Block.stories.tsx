import type { Meta, StoryObj } from "@storybook/react";
import { Block } from ".";

const meta: Meta<typeof Block> = {
  title: "Example/Block",
  component: Block,
};

type Story = StoryObj<typeof Block>;

export const Primary: Story = {
  render: () => <Block />,
};

export default meta;

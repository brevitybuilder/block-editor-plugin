import type { Meta, StoryObj } from "@storybook/react";
import { Block } from ".";

const meta: Meta<typeof Block> = {
  title: "Example/Block",
  component: Block,
};

type Story = StoryObj<typeof Block>;

export const Primary: Story = {
  render: (props) => (
    <Block
      users={[
        {
          id: "ryley",
          family_name: "Randall",
          given_name: "Ryley",
          email: "ryley.randall@gmail.com",
        },
      ]}
    />
  ),
};

export default meta;

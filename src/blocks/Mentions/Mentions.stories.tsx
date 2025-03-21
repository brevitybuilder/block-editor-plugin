import type { Meta, StoryObj } from "@storybook/react";

import { Mentions } from ".";

const meta: Meta<typeof Mentions> = {
  title: "Mentions",
  component: Mentions,
};

type Story = StoryObj<typeof Mentions>;

export const Primary: Story = {
  render: () => (
    <Mentions
      users={[
        { id: "a", given_name: "Andre", family_name: "Rosenkild" },
        { id: "b", given_name: "Ryley", family_name: "Randall" },
      ]}
    />
  ),
};

export default meta;

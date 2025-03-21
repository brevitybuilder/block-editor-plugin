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
      hideSideMenu={true}
      defaultValue={`<div class="bn-block-group" data-node-type="blockGroup"><div class="bn-block-outer" data-node-type="blockOuter" data-id="1e24f12b-7b2b-43b0-b498-fcb83c4aba7e"><div class="bn-block" data-node-type="blockContainer" data-id="1e24f12b-7b2b-43b0-b498-fcb83c4aba7e"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">hello</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="2d5cfbdd-04cd-4761-987f-a7a9b938dbd6"><div class="bn-block" data-node-type="blockContainer" data-id="2d5cfbdd-04cd-4761-987f-a7a9b938dbd6"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content"></p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="4c8b2146-3a58-4630-9fef-7dc2d080cb12"><div class="bn-block" data-node-type="blockContainer" data-id="4c8b2146-3a58-4630-9fef-7dc2d080cb12"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content"></p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="591cab00-b2d4-41a5-948f-045172d3f01a"><div class="bn-block" data-node-type="blockContainer" data-id="591cab00-b2d4-41a5-948f-045172d3f01a"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content"></p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="4bdc49d3-f117-4236-a252-1b09066b3961"><div class="bn-block" data-node-type="blockContainer" data-id="4bdc49d3-f117-4236-a252-1b09066b3961"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">this is</p></div></div></div></div>`}
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

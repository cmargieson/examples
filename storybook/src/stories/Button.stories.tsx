import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import { Button, ButtonProps } from "../";

export default {
  title: "Example/Button",
  component: Button,
  argTypes: {
    kind: {
      control: {
        type: "select",
        options: [
          "primary",
          "secondary",
          "success",
          "warning",
          "danger",
          "info",
          "light",
          "dark",
          "link",
        ],
      },
    },
    size: {
      control: {
        type: "radio",
        options: ["small", "large"],
      },
    },
  },
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  kind: "primary",
  label: "Primary"
};

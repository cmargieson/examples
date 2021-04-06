import { Button } from "./Button";

export default {
  title: "Button",
  component: Button,
};

const Template = (args) => <Button {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  label: "Button",
};

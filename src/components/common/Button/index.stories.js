// /stories/pages/Button.stories.jsx
import Button from '.';
export default {
  title: 'Components/Common/Button',
  component: Button,
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => <Button {...args} />;

//👇 Each story then reuses that template
export const Empty_Button = Template.bind({});
Empty_Button.args = {
  disabled: false,
  children: '',
  className: '',
  onClick: (e) => {},
};
export const Default_Button = Template.bind({});
Default_Button.args = {
  ...Empty_Button.args,
  children: 'Button',
};
export const Disabled_Button = Template.bind({});
Disabled_Button.args = {
  ...Default_Button.args,
  disabled: true,
};
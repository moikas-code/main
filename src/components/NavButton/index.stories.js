// /stories/pages/Button.stories.jsx
import _NavButton from '.';
export default {
  title: 'Components/NavButton',
  component: _NavButton,
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => <_NavButton {...args} />;
export const NavButton = Template.bind({});
NavButton.args = {
  children: 'NavButton',
  className: 'border-none',
  onClick:(e) => {
    e.preventDefault();
    alert('onClick');
  }
};

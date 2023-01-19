// /stories/pages/Button.stories.jsx
import _NavItem from '.';
export default {
  title: 'Components/Blocks/NavItem',
  component: _NavItem,
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => <_NavItem {...args} />;
export const NavItem = Template.bind({});

NavItem.args = {
  children: 'Nav Item',
  className: 'border-none',
  onClick: (e) => {
    e.preventDefault();
    alert('onClick');
  },
};
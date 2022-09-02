//components/Navbar/index.stories.jsx
import _Navbar from '.';

export default {
  title: 'UI/Navbar',
  component: _Navbar,
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => <_Navbar {...args} />;

//👇 Each story then reuses that template
export const Navbar = Template.bind({});
Navbar.args = {
  wrapperCss: '',
  siteTitle: 'Storybook',
  connect: (e) => {
    alert('connecting with metamask');
  },
};

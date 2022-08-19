// /stories/pages/H.stories.jsx
import _H from '.';
export default {
  title: 'Components/H',
  component: _H,
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => <_H {...args} />;

//👇 Each story then reuses that template
export const H = Template.bind({});
H.args = {
  headerSize: '1',
  children: <>H Component</>,
  className: '',
};

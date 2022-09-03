// /stories/pages/Button.stories.jsx
import _StatBlock from '.';
export default {
  title: 'Components/Blocks/StatBlock',
  component: _StatBlock,
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => <_StatBlock {...args} />;
export const StatBlock = Template.bind({});

StatBlock.args = {
  className: '',
  label: 'Label',
  onClick: (e) => {
    e.preventDefault();
    alert('onClick');
  },
};
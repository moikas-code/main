// /stories/pages/Button.stories.jsx
import WalletButton from '.';
export default {
  title: 'Components/WalletButton',
  component: WalletButton,
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => <WalletButton {...args} />;
var address = '';

export const Connected = Template.bind({});
Connected.args = {
  address:
    address.length > 0 ? address : '0x1234567890123456789012345678901234567890',
  onPress: () => {
    alert('onPress');
  },
  onLogin: async () => {
    return (
      typeof window.ethereum !== 'undefined' &&
      (await window.ethereum.enable())
    );
  },
};
export const Disconnected = Template.bind({});
Disconnected.args = {
  ...Connected.args,
  address: address,
};

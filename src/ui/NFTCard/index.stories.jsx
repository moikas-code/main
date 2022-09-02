// /stories/Components/NFTCard/index.stories.jsx
import _NFTCard from '.';

export default {
  title: 'UI/NFTCard',
  component: _NFTCard,
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => <_NFTCard {...args} />;

//👇 Each story then reuses that template
export const NFTCard = Template.bind({});
NFTCard.args = {
  tradeId: '',
  name: 'NFTCard',
  currencySymbol: 'MATIC',
  image: 'ipfs://QmfCZarzQhmMhg4NYgGK4SiehfH7Ui3htbVvHfxCSNLHnC',
  seller_address: '0x9f8F72aA9C92dB49EE7B738dFb0b35C8e88BeE73',
  buyOutPrice: '1',
  network: 'Polygon',
  quantity: '1',
};

// /stories/pages/H.stories.jsx
import {addParameters} from '@storybook/react';
import _NFTCard from '.';





export default {
  title: 'Components/NFTCard',
  component: _NFTCard,
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => <_NFTCard {...args} />;

//👇 Each story then reuses that template
export const NFTCard = Template.bind({});
NFTCard.args = {
  tradeId: '31',
  name: 'NFTCard',
  currencySymbol: 'MATIC',
  image: 'ipfs://QmfCZarzQhmMhg4NYgGK4SiehfH7Ui3htbVvHfxCSNLHnC',
  buyOutPrice: '100',
  network: 'Polygon',
};

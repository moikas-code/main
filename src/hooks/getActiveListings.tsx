import React, {useState} from 'react';
import Web3 from 'web3';
const {DateTime} = require('luxon');
var BN: any = Web3.utils.hexToNumberString;
export default function ActiveListings(dabu: any) {
  const [complete, setComplete] = useState<boolean>(false);
  const [market_nfts, setMarketNFTS] = useState<Array<any>>([]);

  const [error, setError] = useState<Array<any>>([]);

  React.useEffect(() => {
    dabu
      .get_active_nft_listings()
      .then(async(nfts: any) => {
        const listings = await nfts.map((nft: any) => {
          const _tokenId = BN(nft.tokenId._hex);
          // console.log('_tokenId', _tokenId);
          const _quantity = BN(nft.quantity._hex);
          // console.log('_supply', _supply);
          const _price = BN(nft.buyoutPrice._hex);
          // console.log('_price', _price);

          const _startTimeInSeconds = BN(nft.startTimeInSeconds._hex);
          // console.log('_startTimeInSeconds', _startTimeInSeconds);
          const _secondsUntilEnd = BN(nft.secondsUntilEnd._hex);

          let now = Date.now();
          // console.log('assets',nft.asset);
          // arr.push();
          // }

          return {
            ...nft,
            id: nft.id,
            tokenId: _tokenId,
            quantity: _quantity,
            network: nft.network,
            contractAddress: nft.assetContractAddress,
            buyOutPrice: _price.substr(
              0,
              _price.length - nft.buyoutCurrencyValuePerToken.decimals
            ),
            currencySymbol: nft.buyoutCurrencyValuePerToken.symbol,

            decimals: nft.buyoutCurrencyValuePerToken.decimals,
            sellerAddress: nft.sellerAddress,
            startTime: DateTime.fromMillis(
              now - parseInt(_startTimeInSeconds)
            ).toLocaleString(DateTime.DATETIME_SHORT),
            endTime: DateTime.fromMillis(
              now + parseInt(_secondsUntilEnd)
            ).toLocaleString(DateTime.DATETIME_SHORT),
            asset: {
              ...nft.asset,
              id: BN(nft.asset.id._hex),
            },
          };
        }) as any;
        setMarketNFTS(listings);
        setComplete(true);
      })
      .catch((err: any) => {
        setError(err);
      });
  }, [dabu]);
  return {market_nfts, isLoading: !complete, error};
}

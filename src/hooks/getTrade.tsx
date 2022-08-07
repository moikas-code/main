import {gql, useQuery} from '@apollo/client';
import React, {useState} from 'react';
import DABU from '../../dabu';
export default function GetTrade({
  blockchain,
  listingId,
}: {
  blockchain: string;
  listingId: string;
}) {
  var dabu = new DABU();
  dabu.init();
  const [complete, setComplete] = useState<boolean>(false);
  const [trade, setTrade] = useState<any>(null);
  const query = gql`
    query Query_Market_Sell_Order($input: QueryMarketTradeInput) {
      Query_Market_Sell_Order(input: $input) {
        id
        asset {
          id
          name
          description
          image
        }
        currencyContractAddress
        currencySymbol
        buyOutPrice
        decimals
        network
      }
    }
  `;
  let data: any;
  async function handleTrade({
    blockchain,
    listingId,
  }: {
    blockchain: string;
    listingId: string;
  }) {
    const trade = await dabu.get_nft_listing({
      network: blockchain,
      listingId: listingId,
    });
    // console.log(trade);
    return trade;
  }
  React.useEffect(() => {
    blockchain &&
      listingId &&
      handleTrade({
        blockchain,
        listingId,
      }).then(async (res) => {
        // console.log(res);
        setTrade(await res);
        setComplete(true);
      });
  }, [blockchain, listingId]);

  return {
    trade,
    isLoading: !complete,
  };
}

import {gql,useQuery} from '@apollo/client';
import React, {useState} from 'react';
export default function ActiveListings(blockChain: string = 'POLYGON') {
  const [complete, setComplete] = useState<boolean>(false);
  const [market_nfts, setMarketNFTS] = useState<Array<any>>([]);
  const query = gql`
    query Query_Market_Sell_Orders($input: QueryInput) {
      Query_Market_Sell_Orders(input: $input) {
        nfts {
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
        }
      }
    }
  `;
  const {loading, error} = useQuery(query, {
    variables: {
      input: {
        blockChain: blockChain,
      },
    },
    onCompleted: async ({Query_Market_Sell_Orders}:any) => {
      if (
        Query_Market_Sell_Orders !== null &&
        Query_Market_Sell_Orders !== undefined
      ) {
        let cleanCollections: Array<any> = [];
        var i = 0;
        let arr = [] as any;
        let groupArr = [] as any;
        for (const nft of Query_Market_Sell_Orders.nfts) {
          i = i + 1;
          if (
            arr.length < 4 &&
            i !== Query_Market_Sell_Orders.nfts.length - 1
          ) {
            arr.push(nft);
          } else if (i == Query_Market_Sell_Orders.nfts.length - 1) {
            arr.push(nft);
            groupArr.push(arr);
          } else if (arr.length == 4) {
            groupArr.push(arr);
            arr = [];
            arr.push(nft);
          }
        }
        setMarketNFTS(groupArr);
        setComplete(true);
      }
    },
  });

  return {market_nfts, complete, loading, error};
}

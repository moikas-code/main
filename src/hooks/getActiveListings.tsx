import {gql, useQuery} from '@apollo/client';
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
          network
        }
      }
    }
  `;
  const {loading, error, refetch} = useQuery(query, {
    variables: {
      input: {
        blockChain: blockChain,
      },
    },
    onCompleted: async ({Query_Market_Sell_Orders}: any) => {
      if (
        Query_Market_Sell_Orders !== null &&
        Query_Market_Sell_Orders !== undefined
      ) {
        setMarketNFTS(Query_Market_Sell_Orders.nfts);
        setComplete(true);
      }
    },
  });

  return {market_nfts, complete, loading, error, refetch};
}

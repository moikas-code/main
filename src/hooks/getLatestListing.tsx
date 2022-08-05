import {gql, useQuery} from '@apollo/client';
import React, {useState} from 'react';
export default function getLatestListing(blockChain: string = 'POLYGON') {
  const [complete, setComplete] = useState<boolean>(false);
  const [latest_nft, setNFT] = useState<any>({});
  const query = gql`
    query Query_Latest_Market_Sell_Order($input: QueryInput) {
      Query_Latest_Market_Sell_Order(input: $input) {
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
  const {loading, error, refetch} = useQuery(query, {
    variables: {
      input: {
        blockChain: blockChain,
      },
    },
    onCompleted: async ({Query_Latest_Market_Sell_Order}: any) => {
      if (
        Query_Latest_Market_Sell_Order !== null &&
        Query_Latest_Market_Sell_Order !== undefined
      ) {
        setNFT(Query_Latest_Market_Sell_Order);
        setComplete(true);
      }
    },
  });

  return {latest_nft, complete, loading, error, refetch};
}

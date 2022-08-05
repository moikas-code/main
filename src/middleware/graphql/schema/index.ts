import {gql} from 'apollo-server-micro';

const typeDefs = gql`
  input QueryInput {
    address: String
    blockChain: String
    blockchains: [String]
    origin: String
    origins: [String]
    size: Int
    continuation: String
    continuations: [String]
    cursor: String
    sort: String
    activityType: [String]
    start_date: String
  }

  type Collection_Data {
    items: [COLLECTION_ITEM]
    totalSupply: Int
    continuation: String
  }

  type Address_Data {
    unlisted: [COLLECTION_ITEM]
    listed: [COLLECTION_ITEM]
    totalSupply: Int
    continuation: String
  }

  type COLLECTION_OBJ {
    total: Int
    continuation: String
    collections: [COLLECTION]
  }

  type COLLECTION {
    id: String!
    parent: String
    blockchain: String!
    type: String!
    name: String!
    symbol: String
    owner: String
    features: [String]
    minters: [String]
    meta: COLLECTION_META
  }

  type COLLECTION_META {
    name: String!
    description: String
    content: [META_CONTENT]
    externalLink: String
    sellerFeeBasisPoints: Int
    feeRecipient: String
  }

  type META_CONTENT {
    type: String
    width: Int
    height: Int
    url: String
    representation: String
    mimeType: String
    size: Int
  }

  type COLLECTION_ITEM {
    id: String!
    tokenId: String
    blockchain: String
    collection: String
    contract: String
    creators: [Creators]
    lazySupply: String
    mintedAt: String
    lastUpdatedAt: String
    meta: COLLECTION_ITEM_META
    deleted: Boolean
    orders: Int
    isListed: Boolean
  }

  type COLLECTION_ITEM_META {
    name: String!
    description: String
    attributes: [COLLECTION_ITEM_ATTRIBUTE]
    content: [META_CONTENT]
    restrictions: [String]
  }

  type COLLECTION_ITEM_ATTRIBUTE {
    key: String!
    value: String
    type: String
    format: String
  }
  type MARKET_NFTS {
    nfts: [MARKET_NFT]
  }
  type MARKET_NFT {
    id: String
    tokenId: String
    name: String
    description: String
    supply: String
    buyOutPrice: String
    currencySymbol: String
    currencyContractAddress: String
    sellerAddress: String
    startTime: String
    endTime: String
    asset: NFT
    network: String
    decimals: Int
  }

  type NFT {
    id: String
    name: String
    description: String
    uri: String
    image: String
    animation_url: String
    external_url: String
    minted_by: String
    background_color: String
    youtbe_url: String
    fee_recipient: String
    seller_fee_basis_points: Int
  }

  type TAKER_MAKER {
    type: ASSET_TYPE
    value: String
  }
  type ASSET_TYPE {
    type: String
    contract: String
    blockchain: String
    tokenId: String
    uri: String
    creators: [Creators]
    royalties: [ROYALTIES]
  }

  type _DataType {
    type: DataType
    value: String
  }
  type DataType {
    type: String
    contract: String
    tokenId: String
    value: String
  }

  type Creators {
    account: String
    value: Int
  }

  type ROYALTIES {
    address: String
    value: Int
  }

  type Query {
    Query_Latest_Market_Sell_Order(input: QueryInput): MARKET_NFT
    Query_Market_Sell_Orders(input: QueryInput): MARKET_NFTS

    Query_Address_NFTS(input: QueryInput): Address_Data
  }
`;

export default typeDefs;

import React, {useEffect, useState} from 'react';
import TEKRAM from 'tekram/index';
import {useRouter} from 'next/router';
import Link from 'next/link';
import { ChainId, NATIVE_TOKEN, NATIVE_TOKENS} from '@thirdweb-dev/sdk';
import {useMarketplace, useAddress} from '@thirdweb-dev/react';
import Select from 'react-select';
//@ts-ignore
import SEO from '@/src/components/SEO';
// @ts-ignore
import Button from '@/src/components/Button';
// @ts-ignore
import TAKO from '@/src/tako';
import {gql, useLazyQuery} from '@apollo/client';
// @ts-ignore
import Navbar from '@/src/components/Navbar';
import WalletProvider from '../src/components/WalletProvider';
import TakoLink from '../src/components/TakoLink';
import Web3 from 'web3';
import {initWeb3} from '../src/helpers';

function currencyType(blockchain: string) {
  switch (blockchain) {
    case 'ETHEREUM':
      return 'ETH';
    case 'POLYGON':
      return 'MATIC';
    case 'TEZOS':
      return 'XTZ';
    case 'FLOW':
      return 'FLOW';
    case 'SOLANA':
      return 'SOL';
    default:
      return 'NONE';
  }
}
const abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_nativeTokenWrapper',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_thirdwebFee',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timeBuffer',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'bidBufferBps',
        type: 'uint256',
      },
    ],
    name: 'AuctionBuffersUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'listingId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'closer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'bool',
        name: 'cancelled',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'auctionCreator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'winningBidder',
        type: 'address',
      },
    ],
    name: 'AuctionClosed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'listingId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'assetContract',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'lister',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'listingId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'tokenOwner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'assetContract',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'endTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'quantity',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'currency',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'reservePricePerToken',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'buyoutPricePerToken',
            type: 'uint256',
          },
          {
            internalType: 'enum IMarketplace.TokenType',
            name: 'tokenType',
            type: 'uint8',
          },
          {
            internalType: 'enum IMarketplace.ListingType',
            name: 'listingType',
            type: 'uint8',
          },
        ],
        indexed: false,
        internalType: 'struct IMarketplace.Listing',
        name: 'listing',
        type: 'tuple',
      },
    ],
    name: 'ListingAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'listingId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'listingCreator',
        type: 'address',
      },
    ],
    name: 'ListingRemoved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'listingId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'listingCreator',
        type: 'address',
      },
    ],
    name: 'ListingUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'listingId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'offeror',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'enum IMarketplace.ListingType',
        name: 'listingType',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'quantityWanted',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalOfferAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'currency',
        type: 'address',
      },
    ],
    name: 'NewOffer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'listingId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'assetContract',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'lister',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'quantityBought',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalPricePaid',
        type: 'uint256',
      },
    ],
    name: 'NewSale',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'platformFeeRecipient',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'platformFeeBps',
        type: 'uint256',
      },
    ],
    name: 'PlatformFeeInfoUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'newAdminRole',
        type: 'bytes32',
      },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_BPS',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_listingId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_offeror',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_currency',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_pricePerToken',
        type: 'uint256',
      },
    ],
    name: 'acceptOffer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'bidBufferBps',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_listingId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_buyFor',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_quantityToBuy',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_currency',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_totalPrice',
        type: 'uint256',
      },
    ],
    name: 'buy',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_listingId',
        type: 'uint256',
      },
    ],
    name: 'cancelDirectListing',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_listingId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_closeFor',
        type: 'address',
      },
    ],
    name: 'closeAuction',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'contractType',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'contractURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'contractVersion',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'assetContract',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'secondsUntilEndTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'quantityToList',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'currencyToAccept',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'reservePricePerToken',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'buyoutPricePerToken',
            type: 'uint256',
          },
          {
            internalType: 'enum IMarketplace.ListingType',
            name: 'listingType',
            type: 'uint8',
          },
        ],
        internalType: 'struct IMarketplace.ListingParameters',
        name: '_params',
        type: 'tuple',
      },
    ],
    name: 'createListing',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPlatformFeeInfo',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
    ],
    name: 'getRoleAdmin',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getRoleMember',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
    ],
    name: 'getRoleMemberCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'hasRole',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_defaultAdmin',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_contractURI',
        type: 'string',
      },
      {
        internalType: 'address[]',
        name: '_trustedForwarders',
        type: 'address[]',
      },
      {
        internalType: 'address',
        name: '_platformFeeRecipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_platformFeeBps',
        type: 'uint256',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'forwarder',
        type: 'address',
      },
    ],
    name: 'isTrustedForwarder',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'listings',
    outputs: [
      {
        internalType: 'uint256',
        name: 'listingId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'tokenOwner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'assetContract',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'startTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'endTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'currency',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'reservePricePerToken',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'buyoutPricePerToken',
        type: 'uint256',
      },
      {
        internalType: 'enum IMarketplace.TokenType',
        name: 'tokenType',
        type: 'uint8',
      },
      {
        internalType: 'enum IMarketplace.ListingType',
        name: 'listingType',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes[]',
        name: 'data',
        type: 'bytes[]',
      },
    ],
    name: 'multicall',
    outputs: [
      {
        internalType: 'bytes[]',
        name: 'results',
        type: 'bytes[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_listingId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_quantityWanted',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_currency',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_pricePerToken',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_expirationTimestamp',
        type: 'uint256',
      },
    ],
    name: 'offer',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'offers',
    outputs: [
      {
        internalType: 'uint256',
        name: 'listingId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'offeror',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'quantityWanted',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'currency',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'pricePerToken',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expirationTimestamp',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'onERC1155Received',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'onERC721Received',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_timeBuffer',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_bidBufferBps',
        type: 'uint256',
      },
    ],
    name: 'setAuctionBuffers',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_uri',
        type: 'string',
      },
    ],
    name: 'setContractURI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_platformFeeRecipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_platformFeeBps',
        type: 'uint256',
      },
    ],
    name: 'setPlatformFeeInfo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'thirdwebFee',
    outputs: [
      {
        internalType: 'contract ITWFee',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'timeBuffer',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalListings',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_listingId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_quantityToList',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_reservePricePerToken',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_buyoutPricePerToken',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_currencyToAccept',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_startTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_secondsUntilEndTime',
        type: 'uint256',
      },
    ],
    name: 'updateListing',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'winningBid',
    outputs: [
      {
        internalType: 'uint256',
        name: 'listingId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'offeror',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'quantityWanted',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'currency',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'pricePerToken',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expirationTimestamp',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
];
export default function Dragon({address, connected}) {
  async function buy(address,id) {

    console.log(
      `${1*10**18}`,
      '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    );

    const Contract = new window.web3.eth.Contract(
      abi,
      '0x342a4aBEc68E1cdD917D6f33fBF9665a39B14ded'
    );

    await Contract.methods
      .buy(
        id,
        '0x877728846bFB8332B03ac0769B87262146D777f3',
        1,
        '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
         `${1*10**18}`
      )
      .estimateGas({
        from: '0x877728846bFB8332B03ac0769B87262146D777f3',
        value:  `${1*10**18}`,
      })
      .then((gasAmount) => {
        console.log('Gas Spent',gasAmount);
        Contract.methods
          .buy(
            id,
            '0x877728846bFB8332B03ac0769B87262146D777f3',
            1,
            '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
             `${1*10**18}`,
          )
          .send({
            from: '0x877728846bFB8332B03ac0769B87262146D777f3',
            value:  `${1*10**18}`,
            gas: String(Math.floor(gasAmount * 1.25, 10)),
          })
          .on('transactionHash', function (hash) {
            console.log('transactionHash', hash);
          })
          .catch(function (error) {
            if (error.message.includes('User denied transaction signature')) {
              setError('User denied transaction signature');
            }
            if (error.message.includes('err: insufficient funds')) {
              setError('Insufficient Funds');
            }
          });
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  }
  const _market = useMarketplace('0x342a4aBEc68E1cdD917D6f33fBF9665a39B14ded');

  const [complete, setComplete] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [site_message, setSiteMessage] = useState<string | string[]>('');
  const [market_nfts, setMarketNFTS] = useState<Array<any>>([]);
  const [_error, setError] = useState<any>('');
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
          currencySymbol
        }
      }
    }
  `;
  const [Query_Market_Sell_Orders, {loading}] = useLazyQuery(query, {
    onCompleted: async ({Query_Market_Sell_Orders}) => {
      // console.log(Query_Market_Sell_Orders);
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
          console.log(
            '?',
            i == Query_Market_Sell_Orders.nfts.length,
            i,
            Query_Market_Sell_Orders.nfts.length,
            nft
          );
          if (arr.length < 4 && i !== Query_Market_Sell_Orders.nfts.length) {
            arr.push(nft);
          } else if (i == Query_Market_Sell_Orders.nfts.length) {
            arr.push(nft);
            groupArr.push(arr);
            console.log('groupArr', arr, groupArr);
          } else if (arr.length == 4) {
            groupArr.push(arr);
            arr = [];
            arr.push(nft);
          }
        }
        console.log(groupArr);
        setMarketNFTS(groupArr);
        setComplete(true);
      }
    },
  });

  useEffect((): any => {
    initWeb3();
    Query_Market_Sell_Orders({
      variables: {
        input: {
          blockchains: [],
          origins: [
            'ETHEREUM:0x877728846bFB8332B03ac0769B87262146D777f3',
            'SOLANA:98jiC2PfMNqLwUrabW3LxE15dfHCyaNX5V6nxHaP96NQ',
          ],
          continuation: '',
          size: 100,
        },
      },
    });

    return () => {
      setComplete(false);
    };
  }, [address, connected]);

  if (loading) {
    return (
      <div className='h-100 w-100 d-flex flex-column justify-content-center align-items-center'>
        <h1>Market | Tako Labs</h1>
        <hr />
        <p>Trade Your NFTs with Us ❤</p>
        <br />
        Loading NFTS
      </div>
    );
  }
  return (
    <WalletProvider>
      {({connected, address}): any => {
        return (
          <>
            <style jsx>
              {`
                .market {
                  max-width: 1228px;
                }
                .nft-wrapper {
                  min-width: 275px !important;
                  max-width: 285px !important;
                }

                .icon-wrapper img {
                  width: 100%;
                  height: 100%;

                  object-fit: contain;
                }
              `}
            </style>
            <SEO
              title={`Tako Labs - MARKET`}
              description='TAKOLABS.IO: Tako Labs is a WEB3 Community that is focused on the development of decentralized applications and services as well providing gaming content.'
              twitter='takolabs'
              keywords='gaming, nfts, web3'
            />
            <Navbar address={address} connected={connected} />
            <div className='d-flex flex-row justify-content-center align-items-center mx-auto position-relative'>
              <div className='market d-flex flex-column mx-auto m-5 p-3'>
                <p>Site Message: {''}</p>
                <p>Site Fees: 0.10% - is used to keep the lights on ❤</p>
                {market_nfts.map((nfts: any, k) => {
                  return (
                    <div
                      className='d-flex flex-column flex-md-row flex-wrap w-100'
                      key={k}>
                      {nfts.map(
                        ({
                          id,
                          tokenId,
                          currencySymbol,
                          asset: {name, description, image},
                        }: any) => {
                          return (
                            <div
                              id={id}
                              className='nft-wrapper  border border-dark m-2 p-2 d-flex flex-column col justify-content-between'>
                              <div className='icon-wrapper mx-auto'>
                                <img className='mx-auto' src={image} alt='' />
                              </div>
                              <div className='d-flex flex-column'>
                                <hr />
                                <p className='m-0'>{name}</p>
                                <hr />
                                <div className='d-flex flex-row'>
                                  <p>
                                    Price: {1} {currencySymbol}
                                  </p>
                                </div>
                                {true && (
                                  <Button
                                    className='btn btn-dark'
                                    onClick={async () => {
                                      console.log('buy', id);
                                      // buy(address,id);
                                      //@ts-ignore
                                      _market
                                        ?.buyoutListing(
                                          id,
                                          1
                                        )
                                        .then((res: any) => {
                                          console.log(res);
                                        })
                                        .catch((e) => {
                                          console.log(e);
                                        });
                                    }}>
                                    Quick Buy
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        );
      }}
    </WalletProvider>
  );
}

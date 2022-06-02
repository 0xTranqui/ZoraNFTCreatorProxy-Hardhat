/*

How Everything Works

1. Load abi for ZoraNFTCreatorV1 contract (factory contract that allows you to create editions/collections)
2. Instantiate the ZoraNFTCreatorProxy contract, passing in the abi for the ZoraNFTCreatorV1 contract
3. Define the paramters you want to pass into the createDrop function
4. Send a transaction to the ZoraNFTCreatorProxy contract calling the createDrop function
5. The ZoraNFTCreatorProxy contract will then make multiple calls to set up your NFT
contract. One of which will be the creation of a contract called "ERC721DropProxy",
which is actually your end product. On etherscan, you must confirm that it is indeed a proxy
by going to the contract page, clicking the code tab, clicking the "More Options" button,
and then clicking the "Is this a proxy?" dropdown
6. This will then take you to a UI that allows you to verify your contract as a proxy contract
7. Once complete, go back to your ERC721DropProxy contract on etherscan and you can start interacting with it!

*/


// ========== Deployment Infrastructure Setup ==========

// * Imports *  

// instantiates pointer to file containing ZoraNFTCreatorV1 abi. THIS IS CONFUSING since you are 
const ZoraNFTCreatorV1_ABI = require("../node_modules/@zoralabs/nft-drop-contracts/dist/artifacts/ZoraNFTCreatorV1.sol/ZoraNFTCreatorV1.json");
const { ethers } = require("hardhat");

// * Deployment Variables *

// setting variables for API key, deployer key, contract address, desired network
const API_KEY = process.env.ALCHEMY_KEY
const PRIVATE_KEY = process.env.DEPLOYER_KEY
const ZoraNFTCreatorProxy_ADDRESS_RINKEBY = "0x2d2acD205bd6d9D0B3E79990e093768375AD3a30"
const ZoraNFTCreatorProxy_ADDRESS_MAINNET = "0xF74B146ce44CC162b601deC3BE331784DB111DC1"

// set proxyAddress = to rinkeby or mainnet variable
const proxyAddress = ZoraNFTCreatorProxy_ADDRESS_RINKEBY

// * Initiating Call *

// instantiating ethers provider
const alchemyProvider = new ethers.providers.AlchemyProvider(network="rinkeby", API_KEY);

// instantiating ethers signer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// instantiating ZoraNFTCreatorProxy contract to call later
const ZoraNFTCreatorProxy = new ethers.Contract(proxyAddress, ZoraNFTCreatorV1_ABI.abi, signer)


// ========== Contract Call Setup ==========

// * Params Description *

// contract params for ZoraNFTCreatorProxy are as follows : 

// name (string)
// symbol (string)
// defaultAdmin (address)
// editionSize (uint64)
// royaltyBPS (uint16) --> 100 bps = 1%
// fundsRecipient (address)
// salesConfig (tuple) - see below for detailed breakdown
// metadataURIBase (string) - current mint number will be appended to end of this string upon each mint
// metadataContractURI (string) - still not sure

// salesConfig (tuple) params are as follows:

// publicSalePrice (uint104) - mint price in wei
// maxSalePurchasePerAddress (uint32) - purchase mint limit per address (if set to 0 === unlimited mints)
// publicSaleStart (uint64) - public sale start timestamp (block.timestamp) - helpful link for getting current timestamp -> https://www.unixtimestamp.com/
// publicSaleEnd (uint64) - public sale start timestamp (block.timestamp)
// presaleStart (uint64) - presale start timestamp (set to 0 if no presale)
// presaleEnd (uint64) - presale end timestamp (set to 0 if no presale)
// presaleMerkleRoot (bytes32) - set this to the following if not implementing an allowList: "0x0000000000000000000000000000000000000000000000000000000000000000"

// * Establishing createDrop Arguments

// hardcode desired mint price in ether as a string
const price = "0.01"

const createDropArgs = [
   "Sample Project Name", // name - string
   "TEST", // symbol - string
   "your adddress here", // defaultAdmin - address
   100, // editionSize - uint64
   0, // royaltyBPS - uint16 - NOTE: 100bps = 1%
   "your address here", // fundsRecipient - address
   [ // salesConfig - tuple
      ethers.utils.parseEther(price), // publicSalePrice (wei) - uint104
      0, // maxSalePurchasePerAddress - uint32
      1654181910, // publicSaleStart - uint64
      5000000000, // publicSaleEnd - uint64
      0, // presaleStart - uint64
      0, // presaleEnd - uint64
      "0x0000000000000000000000000000000000000000000000000000000000000000", // presaleMerkleRoot - bytes32
   ], 
   "example ->", // metadataURIBase - string - ex: ipfs://bafybeia67q6eabx2rzu6datbh3rnsoj7cpupudckijgc5vtxf46zpnk2t4/
   "example ->", // metadataContractURI - string - ex: ipfs://QmSdWDgtKSSJgGvPcn9WrHTeAoVrTZyhARY2NeZLyWpPi2/metadata.json 
]

async function main() {
const createDrop = await ZoraNFTCreatorProxy.createDrop(
   createDropArgs[0], // Collection Name
   createDropArgs[1], // Collection Symbol
   createDropArgs[2], // Contract Admin
   createDropArgs[3], // Token Supply
   createDropArgs[4], // Royalty Bps
   createDropArgs[5], // Funds Recipient
   createDropArgs[6], // Sales Config
   createDropArgs[7], // metadataBaseURI
   createDropArgs[8], // metadataContractURI
)
const txResult = await createDrop.wait()
console.log("Transaction successful!")
console.log("NFT contract address =", txResult.logs[0].address)
console.log("Transaction hash of NFT contract creation =", txResult.logs[0].transactionHash)
}

main()
.then(() => process.exit(0))
.catch((error) => {
   console.error(error);
   process.exit(1);
});





// ========== EXTRA RESOURCES ==========

// direct copy of SalesConfig + SaleDetails structs specified in IERC721Drop.sol (file 11 of this contract https://rinkeby.etherscan.io/address/0xd0a79ded1e06b8e242ff4763d91c674dc6dcd67d#code)
// front end can query SaleDetails to get # of mints + total supply, sale active status, etc.

/*

   /// @notice Sales states and configuration
   /// @dev Uses 3 storage slots
   struct SalesConfiguration {
      /// @dev Public sale price (max ether value > 1000 ether with this value)
      uint104 publicSalePrice;
      /// @notice Purchase mint limit per address (if set to 0 === unlimited mints)
      /// @dev Max purchase number per txn (90+32 = 122)
      uint32 maxSalePurchasePerAddress;
      /// @dev uint64 type allows for dates into 292 billion years
      /// @notice Public sale start timestamp (136+64 = 186)
      uint64 publicSaleStart;
      /// @notice Public sale end timestamp (186+64 = 250)
      uint64 publicSaleEnd;
      /// @notice Presale start timestamp
      /// @dev new storage slot
      uint64 presaleStart;
      /// @notice Presale end timestamp
      uint64 presaleEnd;
      /// @notice Presale merkle root
      bytes32 presaleMerkleRoot;
   }


   /// @notice Return value for sales details to use with front-ends
   struct SaleDetails {
      // Synthesized status variables for sale and presale
      bool publicSaleActive;
      bool presaleActive;
      // Price for public sale
      uint256 publicSalePrice;
      // Timed sale actions for public sale
      uint64 publicSaleStart;
      uint64 publicSaleEnd;
      // Timed sale actions for presale
      uint64 presaleStart;
      uint64 presaleEnd;
      // Merkle root (includes address, quantity, and price data for each entry)
      bytes32 presaleMerkleRoot;
      // Limit public sale to a specific number of mints per wallet
      uint256 maxSalePurchasePerAddress;
      // Information about the rest of the supply
      // Total that have been minted
      uint256 totalMinted;
      // The total supply available
      uint256 maxSupply;
   }

*/

// example SalesConfiguration to pass into contract when if testing on etherscan:
// [0, 0, 1654181910, 50000000000, 0, 0, "0x0000000000000000000000000000000000000000000000000000000000000000"]
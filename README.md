# Interacting with the ZoraNFTCreatorProxy using Hardhat

This project provides the bare bones infrastructure needed to interact
with the ZoraNFTCreatorProxy contract on both [rinkeby](https://rinkeby.etherscan.io/address/0x2d2acD205bd6d9D0B3E79990e093768375AD3a30) and [mainnet](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)

Currently, the only official / public UI for interacting with Zora's new [drop contracts](https://github.com/ourzora/zora-drops-contracts) is available at
[create.zora.co](https://create.zora.co/). This repo extends that functionality by facilitating the creation of "drop" collections -- allowing you to have unique media for each NFT, differing from edition contracts that assist in the creation of NFTs that "contain" the same media

To get started, follow these steps:

```
1. Fork repo locally

2. Run npm install

3. Create a .env following the structure of .env.example to hold your deployer key + alchemy key (you can adjust this to a different RPC provider if you want, will just need to make adjustments in hardhat.config.js and ZoraNFTCreatorProxy.js)

3. Navigate to scripts/ZoraNFTCreatorProxy.js

4. Update line 37 to determine rinkeby/mainnet deployment

4. Update lines 80-100 with your desired inputs

5. in your terminal, run "npx hardhat --network rinkeby/mainnet run scripts/ZoraNFTCreatorProxy.js"

6. Copy paste the deployed contract address shown in the console into etherscan
to confirm contract deployment
```

Thats it!

Feel free to hit me up at [tranqui.eth](https://twitter.com/0xTranqui) if you have any questions :)

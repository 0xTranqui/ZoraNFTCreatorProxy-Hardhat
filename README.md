# Interacting with the ZoraNFTCreatorProxy

- NOTE: This is an unofficial guide and not affilitated with Zora in anyway \*

This project provides the bare bones infrastructure needed to interact
with the ZoraNFTCreatorProxy contract on both [rinkeby](https://rinkeby.etherscan.io/address/0x2d2acD205bd6d9D0B3E79990e093768375AD3a30) and [mainnet](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)

Specifically, it allows you to call the "createDrop" function, which facilitates
the creation of your own custom ERC721 collection that you will have full admin
control over upon creation

Currently, the only official / public UI for interacting with Zora's new [drop contracts](https://github.com/ourzora/zora-drops-contracts) is available at
[create.zora.co](https://create.zora.co/), which only allows facilitates the creation of edition collections and doesn't provide complete access to the full range of cabability provided by their new drop contract infrastructure

To get started, follow these steps:

fork repo

npm install

navigate to scripts/ZoraNFTCreatorProxy.js

update lines 80-100 with your desired inputs

in your terminal, run "npx hardhat run scripts/ZoraNFTCreatorProxy.ks"

Thats it!

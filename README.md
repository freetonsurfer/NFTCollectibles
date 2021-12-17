# NFTCollectibles

### Architecture

All data are stored onchain. There are four types of contracts

**NftCollectiion** - is the root contract that stores data for a specific collection
```
     address _owner; - collection owner address
     uint8 _levelCount; - the number of levels in the collection
     uint32 _firstLvlImgCount; - number of images on the first level
     uint32 _supply; - the number of tokens that can be minted
     uint32 _minted; - the number of minted tokens
     bool _complete; - the assembly is ready for minting a token or is under construction. Once it is set to true, the collection cannot be changed
     TvmCell _imageCode; - Image contract code
     TvmCell _tokenCode; - Token contract code
     TvmCell _certCode; - UserCert contract code
```

**Image** is a contract that stores image data and information about the position of an image in a collection.
```
      static address _root; - NftCollectiion address
      uint8 static _level; - level number
      uint8 static _id; - position at the level
      uint8 _chunks; - number of image data blocks
      display (uint8 => bytes) _content; - image data
      bool public _complete; - whether the image is ready for minting a token or is it under construction. Once it is set to true, the image cannot be changed
      uint64 _price; - image price
      uint8 _levelImageCount; - number of images for the current level
      uint8 _nextLevelImageCount; - number of images for the next level
      address _owner; - the address where you can send a request for the image. Once set to true image, the image cannot be changed
      string _name; - image name
```

**Token** is a minted collectible token. This is store information about the image.
```
      code salt NftCollectiion address
      uint8 [] static _images; - Image link. The position in the array is Image _level, the value is Image _id.
      address _owner; - Token owner.
      TvmCell _certCode; - UserCert code.
```

**UserCert** - it is index contract for finding token contract for specific user
```
    code salt Token address.
    address static _token; - address of Token contract.
```

#### Calculating the price of the token

To calculate the price of a token, you must add up the price of each image contained in that token.

#### How to find all images for NftCollectiion

The image contract has static variables _root, _level, _id. To find all images for NftCollectiion, you first need to get _levelCount. Each level must have at least one image. You can call NftCollectiion.getImageAddress(_level, _id) for each level with image id 0. From the image, you can get _levelImageCount. This is a variable equal to the number of images in the level. And now you can evaluate the address for all images

#### How to find all tokens for NftCollectiion

To receive all minted tokens, you must obtain a token code. Paste the NftCollectiion address into the code salt, get a hash and find all contracts with such hash.

#### How to find user tokens

There is a UserCert contract that helps you find all user tokens. You should get the UserCert code, insert the user's address in the salt code, get the hash and find all contracts with such a hash. You will find UserCert contracts that store the token address. Tokens can be issued by different NftCollectiions, so to find all custom tokens for a specific collection, you must check the _root address in the token contract.

#### Minting procedure

For token mint, the user must select an image at each level and call NftCollection.mint. The parameter of this call is the array of image indexs, the position in the array is the level id. When the NftCollection receives a mint request, it calculates the addresses of the Token that should be mint and stores it in the request queue, and now no one else can try to mint the token with the same image IDs. NftCollection sends a request to the token address to check if the contract exists. If the contract exists, it will call the onExist function, which will remove the request from the queue. If the contract does not exist onBounce function will be called. NtfCollection send a request for the image from the first level. The image from the first level call the image from the second level, and so on. This helps to estimate the price of mint. The last layer image will call NtfCollection. NtfCollection verifies that the mint price is greater than the user's message value and deploy Token. After deploying the Token, the Token will call NtfCollection.removeQuery to remove the request from the queue.

**Note: When minting, the integrity of the data in the contracts is checked. The contracts exchange messages. DeBot waits for the completion of the entire chain of transactions, therefore, the minting of a token in DeBot takes about 1 minute 30 seconds**

### Configuration

Please use compiler version 0.47.0

`config/deploy_config.js` contain config information

`config/owner_msig.keys.js` contain keys for owner wallet

### NPM Commands

`npm install` – download required modules

`npm run build` – build contracts. Please use compiler version 0.47.0

`npm run build_debot` – build debot. Please use compiler version 0.47.0

`npm run test` – run tests. Please set proper config

`npm run deploy` – deploy contracts and check it integrity

`npm run deploy_debot` – deploy DeBot

### How to try

Demo contracts are deploy to main net

Your can check DeBot

NFT CATS

https://uri.ton.surf/debot/0:d553e69472f8c42141e085c017d98ec07f78377514241570adfeda6346467017

### How to deploy your own collection

1 clone repository

2 run npm install

3 Go to config/deploy_config.js and configure your images

4 Go to config/owner_wallet.keys.js and set your keys

5 Run npm run test in localnode and check that everything is good

6 Run npm run deploy 

8 configure debot/deploy_debot.sh set nftRoot address and nftRoot public key and giver properties

9 run npm run deploy_debot

10 Enjoy your collection

### TODO
- Improve DeBot
- Merge images in DeBot and show result to user
- Try to store Token information about layers in TvmCell

### Contacts
`Telegram` @freetonsurfer

`Surf` 0:299c9cfcc59064679c2a580223a85d42f9f7b453e28abc781b45d45a99386722

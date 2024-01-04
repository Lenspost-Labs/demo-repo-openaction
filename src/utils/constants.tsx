export const network: string = "polygon"; // options: 'polygon', 'mumbai'

// mode flag sets whether to fetch smart post instances from Lens API or querying directly from contract events
// Mumbai open actions are always indexed on the Lens API, Polygon actions need to be allowlisted on the API (though they are permisionless on-chain)
// To request allowlist for Polygon actions, you can submit a PR to https://github.com/lens-protocol/open-actions-directory
export const mode: string = "api"; // options: 'api', 'events'
export const ipfsGateway = "https://ipfs.io/ipfs/";
export const arweaveGateway = "https://arweave.net/";

interface UiConfig {
  helloWorldContractAddress: `0x${string}`;
  helloWorldContractStartBlock: number;
  openActionContractAddress: `0x${string}`;
  openActionContractStartBlock: number;
  lensHubProxyAddress: `0x${string}`;
  collectActionContractAddress: `0x${string}`;
  simpleCollectModuleContractAddress: `0x${string}`;
  blockExplorerLink: string;
  rpc: string;
}

console.log(network);
export const uiConfig: UiConfig = {
  helloWorldContractAddress: "0x6adc2f64fbf5ca406650d58f9442a9eae78c0dbc",
  helloWorldContractStartBlock: 50547287,
  openActionContractAddress: import.meta.env.VITE_OPEN_ACTION_CONTRACT_ADDRESS,
  openActionContractStartBlock: 50547287,
  lensHubProxyAddress: "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d",
  collectActionContractAddress: "0x0D90C58cBe787CD70B5Effe94Ce58185D72143fB",
  simpleCollectModuleContractAddress:
    "0x060f5448ae8aCF0Bc06D040400c6A89F45b488bb",
  blockExplorerLink: "https://polygonscan.com/tx/",
  rpc: `https://polygon-mainnet.g.alchemy.com/v2/${
    import.meta.env.VITE_ALCHEMY_POLYGON_API_KEY
  }`,
};
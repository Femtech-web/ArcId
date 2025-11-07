import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { Chain, mainnet, sepolia, arcTestnet } from 'wagmi/chains';

export const anvil: Chain = {
  id: 31337,
  name: 'Local Anvil',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
  blockExplorers: {
    default: { name: 'Local', url: 'http://127.0.0.1:8545' },
  },
  testnet: true,
};

export const config = getDefaultConfig({
  appName: 'ArcID Dashboard',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, sepolia, arcTestnet, anvil],
  ssr: true,
});

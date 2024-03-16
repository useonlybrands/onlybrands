import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

import Layout from "@/components/partials/Layout";
import { AppProps } from "@/types";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

const evmNetworks = [
  {
    blockExplorerUrls: ['https://testnet.chiliscan.com/'],
    chainId: 88882,
    chainName: 'Chiliz Spicy Testnet',
    iconUrls: ['https://app.dynamic.xyz/assets/networks/chiliz.svg'],
    name: 'Chiliz Spicy',
    nativeCurrency: {
      decimals: 18,
      name: 'Chiliz',
      symbol: 'CHZ',
    },
    networkId: 88882,
    
    rpcUrls: ['https://spicy-rpc.chiliz.com/'],
    vanityName: 'Chiliz Testnet',
  }
]

const App = (props: AppProps): JSX.Element => {
  const { Component, pageProps } = props;

  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID || "",
        walletConnectors: [EthereumWalletConnectors],
        evmNetworks
      }}
    >
        {/* <DynamicWidget /> */}
        <Layout>
          <Component {...pageProps} />
          <ToastContainer
            autoClose={1800}
            closeOnClick
            hideProgressBar
            limit={10}
            pauseOnHover
            position={toast.POSITION.TOP_RIGHT}
            role="alert"
          />
        </Layout>
    </DynamicContextProvider>
  );
};

export default App;

import {DynamicContextProvider, DynamicUserProfile} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import Layout from "@/components/partials/Layout";
import { AppProps } from "@/types";
import { toast, ToastContainer } from "react-toastify";
import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { evmNetworks } from "@/utils/dyanmicNetworks";
import router from "next/router";
import Button from "@/components/UI/Button";

const App = (props: AppProps): JSX.Element => {
  const { Component, pageProps } = props;

  return (
    <DynamicContextProvider
      settings={{
        eventsCallbacks: {
          onAuthSuccess: (args) => {
            router.push("/register");
            console.log("USER CONNECTED... REDIRECTING TO REGISTER", args);
          },
        },
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID || "",
        walletConnectors: [EthereumWalletConnectors],
        evmNetworks,
        logLevel: "DEBUG",
        debugError: true,
        displaySiweStatement: true,
        customPrivacyPolicy: (
          <div>
          {/* DO THE CONNECT WITH WORLDCOIN */}
            <Button>Connect</Button>
          </div>
        ),
      }}
    >
        <DynamicUserProfile/>
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

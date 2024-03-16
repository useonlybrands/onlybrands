import {
  DynamicContextProvider,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import Layout from "@/components/partials/Layout";
import { AppProps } from "@/types";
import { toast, ToastContainer } from "react-toastify";
import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { evmNetworks } from "@/utils/dyanmicNetworks";
import router from "next/router";

const App = (props: AppProps): JSX.Element => {
  const { Component, pageProps } = props;

  return (
    <DynamicContextProvider
      settings={{
        eventsCallbacks: {
          onConnect: (args) => {
            router.push("/login");
            console.log("yooo");
          },
        },
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID || "",
        walletConnectors: [EthereumWalletConnectors],
        evmNetworks,
        policiesConsentInnerComponent: (
          <div>
            <p>
              By clicking “Connect”, you agree to our{" "}
              <a
                href="https://www.dynamic.xyz/terms-of-service"
                target="_blank"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="https://www.dynamic.xyz/privacy-policy" target="_blank">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        ),
      }}
    >
      
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

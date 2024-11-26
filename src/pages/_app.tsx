import { createTheme, MantineProvider } from "@mantine/core";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

const theme = createTheme({
  /** Put your mantine theme override here */
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <DynamicContextProvider
        settings={{
          environmentId: publicRuntimeConfig.dynamicEnvironmentId,
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        <Component {...pageProps} />
      </DynamicContextProvider>
    </MantineProvider>
  );
}

import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/provider";
import { customTheme } from "@/styles/customTheme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={customTheme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

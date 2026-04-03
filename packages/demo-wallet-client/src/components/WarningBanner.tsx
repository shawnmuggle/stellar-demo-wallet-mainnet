import { Networks } from "@stellar/stellar-sdk";
import { StatusBar } from "@stellar/design-system";
import { getNetworkConfig } from "demo-wallet-shared/build/helpers/getNetworkConfig";

export const WarningBanner = () => {
  const { network, url } = getNetworkConfig();

  if (!network || network === Networks.TESTNET) {
    return null;
  }

  return (
    <>
      <StatusBar variant={StatusBar.variant.error}>
        MAINNET — Test with small amounts only. All actions affect real assets.
      </StatusBar>
      {network !== Networks.PUBLIC && (
        <StatusBar variant={StatusBar.variant.warning}>
          {`WARNING: You’ve connected to ${url}`}
        </StatusBar>
      )}
    </>
  );
};

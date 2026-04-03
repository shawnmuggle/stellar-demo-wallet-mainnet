import { StellarToml } from "@stellar/stellar-sdk";
import toml from "toml";
import { normalizeHomeDomainUrl } from "../helpers/normalizeHomeDomainUrl";

const isLocalhost =
  typeof window !== "undefined" &&
  window.location.hostname === "localhost";

export const getToml = async (homeDomain: string) => {
  const tomlURL = normalizeHomeDomainUrl(homeDomain);
  tomlURL.pathname = "/.well-known/stellar.toml";

  // In local development, proxy through the dev server to avoid CORS issues
  if (isLocalhost) {
    const proxyUrl = `/cors-proxy?url=${encodeURIComponent(tomlURL.toString())}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch stellar.toml from ${tomlURL}: ${response.statusText}`);
    }
    const text = await response.text();
    return toml.parse(text);
  }

  const tomlResponse =
    tomlURL.protocol === "http:"
      ? await StellarToml.Resolver.resolve(tomlURL.host, {
          allowHttp: true,
        })
      : await StellarToml.Resolver.resolve(tomlURL.host);

  return tomlResponse;
};

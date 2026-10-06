import { useEffect, useState } from "react";

import { getRouteFromHash } from "@/app/routes";

const defaultHash = "#/dashboard";

function readHash() {
  if (window.location.hash) {
    return window.location.hash;
  }

  window.history.replaceState(null, "", defaultHash);
  return defaultHash;
}

export function useHashRoute() {
  const [hash, setHash] = useState(() => readHash());

  useEffect(() => {
    const handleHashChange = () => {
      setHash(readHash());
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return {
    hash,
    route: getRouteFromHash(hash),
  };
}

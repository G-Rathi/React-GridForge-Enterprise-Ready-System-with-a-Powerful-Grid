import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { serviceClient } from "../services/http/serviceClient";

export function useCancelApiOnRouteChange() {
  const location = useLocation();

  // don't cancel on initial mount — only when the location actually changes
  const didMountRef = useRef(false);
  const prevPathRef = useRef(location.pathname);

  useLayoutEffect(() => {
    if (!didMountRef.current) {
      // first mount: set current route so initial page requests are associated correctly
      didMountRef.current = true;
      serviceClient.setCurrentRoute(location.pathname);
      prevPathRef.current = location.pathname;
      return;
    }

    const prev = prevPathRef.current;

    // set current route first so newly mounting page requests get the new route
    serviceClient.setCurrentRoute(location.pathname);

    // then cancel only requests that belonged to the previous route
    serviceClient.cancelRequestsForRoute(prev);

    prevPathRef.current = location.pathname;
  }, [location.pathname]);
}

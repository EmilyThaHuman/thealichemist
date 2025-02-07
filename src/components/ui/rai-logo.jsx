import { LogoV1 } from "./LogoV1";
import { LogoV2 } from "./LogoV2";
import { LogoV3 } from "./LogoV3";
import { LogoV4 } from "./LogoV4";
import { LogoV5 } from "./LogoV5";
import { LogoV6 } from "./LogoV6";

export const RaiLogo = (variant = "v1") => {
  if (variant === "v1") {
    return <LogoV1 />;
  } else if (variant === "v2") {
    return <LogoV2 />;
  } else if (variant === "v3") {
    return <LogoV3 />;
  } else if (variant === "v4") {
    return <LogoV4 />;
  } else if (variant === "v5") {
    return <LogoV5 />;
  } else if (variant === "v6") {
    return <LogoV6 />;
  }
};

export default RaiLogo;

import { minidenticon } from "minidenticons";
import { useMemo } from "react";

const AutoAvatar = ({
  username,
  saturation,
  lightness,
  ...props
}: {
  username: string;
  saturation?: number;
  lightness?: number;
  [key: string]: any;
}) => {
  const svgURI = useMemo(
    () =>
      "data:image/svg+xml;utf8," +
      encodeURIComponent(minidenticon(username, saturation, lightness)),
    [username, saturation, lightness]
  );
  return <img src={svgURI} alt={username} {...props} />;
};

export default AutoAvatar;

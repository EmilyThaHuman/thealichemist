import PropTypes from "prop-types";

export const AlichemistLogo = ({
  className = "",
  width = 300,
  height = 300,
}) => {
  return (
    <div className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 250"
        width={width}
        height={height}
        className="w-full h-full"
        preserveAspectRatio="xMinYMin meet"
      >
        <style>
          {`
            @font-face {
              font-family: 'LogoFont';
              src: local('Arial Black'), local('Arial-Black'), local('Impact');
              font-weight: 900;
            }
            text {
              font-family: 'LogoFont', sans-serif;
              font-weight: 900;
              fill: currentColor;
              letter-spacing: -0.03em;
            }
          `}
        </style>

        <text x="10" y="65" fontSize="75" className="text-current">
          THE
        </text>
        <text x="10" y="140" fontSize="75" className="text-current">
          ALICH-
        </text>
        <text x="10" y="215" fontSize="75" className="text-current">
          EMIST
        </text>
      </svg>
    </div>
  );
};

AlichemistLogo.displayName = "AlichemistLogo";

AlichemistLogo.propTypes = {
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default AlichemistLogo;

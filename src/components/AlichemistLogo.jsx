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
        viewBox="0 0 400 300"
        width={width}
        height={height}
        className="w-full h-full"
        preserveAspectRatio="xMinYMin meet"
      >
        <style>
          {`
            @font-face {
              font-family: 'CustomFont';
              src: local('Arial Black'), local('Arial-Black');
            }
            text {
              font-family: 'CustomFont', sans-serif;
              font-weight: 900;
              fill: currentColor;
            }
          `}
        </style>

        <text x="0" y="80" fontSize="120" className="text-current">
          THE
        </text>
        <text x="0" y="160" fontSize="120" className="text-current">
          ALICH-
        </text>
        <text x="0" y="240" fontSize="120" className="text-current">
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

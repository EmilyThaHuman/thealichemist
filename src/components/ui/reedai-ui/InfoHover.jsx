import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { ToolTip } from "./gui/Tooltip";
import PropTypes from 'prop-types';
import { memo } from 'react';

const InfoHover = memo(({ msg }) => {
  const id = `info-hover-${encodeURIComponent(msg)}`;

  return (
    <>
      <InformationCircleIcon
        data-tooltip-id={id}
        className="h-5 w-5 cursor-help text-gray-500 hover:text-gray-700 transition-colors"
      />
      <ToolTip id={id} place="bottom">
        {msg}
      </ToolTip>
    </>
  );
});

InfoHover.propTypes = {
  msg: PropTypes.string.isRequired
};

InfoHover.displayName = 'InfoHover';

export default InfoHover;

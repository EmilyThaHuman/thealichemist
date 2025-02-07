import { BookOpenIcon } from "@heroicons/react/24/outline";
import { memo, useState, useCallback } from "react";
import styled from "styled-components";
import { defaultBorderRadius, greenButtonColor, lightGray } from "..";
import { providers } from "../../pages/AddNewModel/configs/providers";
import HeaderButtonWithToolTip from "../gui/HeaderButtonWithToolTip";
import InfoHover from "../InfoHover";
import { ModelProviderTag } from "./ModelProviderTag";
import PropTypes from 'prop-types';

const ModelCardContainer = styled.div`
  border: 1px solid ${lightGray};
  border-radius: ${defaultBorderRadius};
  position: relative;
  width: 100%;
  transition: all 0.3s ease;

  ${({ disabled, hovered, color }) =>
    disabled
      ? `opacity: 0.5;`
      : hovered
      ? `
    border: 1px solid ${color};
    background-color: ${color}22;
    cursor: pointer;`
      : ""}
`;

const DimensionsDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
  padding: 4px;
  flex-wrap: wrap;
  row-gap: 12px;
  border-top: 1px solid ${lightGray};
`;

const DimensionOptionDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 8px;
  background-color: ${lightGray};
  padding: 4px;
  border-radius: ${defaultBorderRadius};
  outline: 0.5px solid ${lightGray};

  ${(props) =>
    props.selected &&
    `
    background-color: ${greenButtonColor};
    color: white;
  `}

  &:hover {
    cursor: pointer;
    outline: 1px solid #007fd4;
  }
`;

const ModelCard = memo(({
  disabled = false,
  dimensions = [],
  providerOptions = [],
  icon,
  title,
  description,
  refUrl,
  tags = [],
  onClick
}) => {
  const [dimensionChoices, setDimensionChoices] = useState(
    dimensions.map((d) => Object.keys(d.options)[0]) || []
  );
  const [hovered, setHovered] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(providerOptions[0]);

  const handleClick = useCallback((e) => {
    if (disabled || e.target.closest('a')) return;
    onClick(e, dimensionChoices, selectedProvider);
  }, [disabled, dimensionChoices, selectedProvider, onClick]);

  const handleDimensionChange = useCallback((index, key) => {
    setDimensionChoices(prev => {
      const newChoices = [...prev];
      newChoices[index] = key;
      return newChoices;
    });
  }, []);

  return (
    <ModelCardContainer
      disabled={disabled}
      color={greenButtonColor}
      hovered={hovered}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="px-2 py-1"
        onClick={handleClick}
      >
        <div
          className="mb-2"
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {window.vscMediaUrl && icon && (
            <img
              src={`${window.vscMediaUrl}/logos/${icon}`}
              width="24px"
              height="24px"
              style={{
                borderRadius: "2px",
                padding: "4px",
                marginRight: "10px",
                objectFit: "contain",
              }}
            />
          )}
          <h3>{title}</h3>
        </div>

        {tags.map((tag, i) => (
          <ModelProviderTag key={i} tag={tag} />
        ))}

        <p>{description}</p>

        {refUrl && (
          <a
            style={{
              position: "absolute",
              right: "8px",
              top: "8px",
            }}
            href={refUrl}
            target="_blank"
          >
            <HeaderButtonWithToolTip text="Read the docs">
              <BookOpenIcon width="1.6em" height="1.6em" />
            </HeaderButtonWithToolTip>
          </a>
        )}
      </div>

      {(dimensions.length || providerOptions.length) && (
        <DimensionsDiv>
          {dimensions.map((dimension, i) => {
            return (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <InfoHover msg={dimension.description} />
                  <p className="mx-2 my-0 py-0 text-sm">{dimension.name}</p>
                </div>
                <div className="flex items-center">
                  {Object.keys(dimension.options).map((key) => {
                    return (
                      <DimensionOptionDiv
                        key={key}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDimensionChange(i, key);
                        }}
                        selected={dimensionChoices[i] === key}
                      >
                        {key}
                      </DimensionOptionDiv>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {providerOptions.length && (
            <div className="rtl flex flex-wrap items-center justify-end">
              <div className="flex items-center">
                <InfoHover
                  msg={
                    "Select the provider through which you will access the model"
                  }
                />
              </div>
              <div className="rtl flex flex-wrap items-center justify-end">
                {providerOptions.map((option, i) => {
                  const info = providers[option];
                  if (!info) {
                    return null;
                  }
                  return (
                    <HeaderButtonWithToolTip
                      key={option}
                      text={info.title}
                      className="mx-1 items-center p-2 text-center"
                      style={{
                        backgroundColor:
                          (i === 0 &&
                            typeof selectedProvider === "undefined") ||
                          selectedProvider === option
                            ? greenButtonColor + "aa"
                            : undefined,
                      }}
                      onClick={() => {
                        setSelectedProvider(option);
                      }}
                    >
                      {window.vscMediaUrl && info.icon && (
                        <img
                          src={`${window.vscMediaUrl}/logos/${info.icon}`}
                          height="24px"
                        />
                      )}
                    </HeaderButtonWithToolTip>
                  );
                })}
              </div>
            </div>
          )}
        </DimensionsDiv>
      )}
    </ModelCardContainer>
  );
});

ModelCard.propTypes = {
  disabled: PropTypes.bool,
  dimensions: PropTypes.array,
  providerOptions: PropTypes.array,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  refUrl: PropTypes.string,
  tags: PropTypes.array,
  onClick: PropTypes.func.isRequired
};

ModelCard.displayName = 'ModelCard';

export default ModelCard;

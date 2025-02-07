"use client";

import { forwardRef, useCallback, useRef, useState } from "react";

const DEFAULT_BLUR_URL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

// Basic image loader that handles relative and absolute URLs
const defaultLoader = ({ src, width, quality }) => {
  if (src.startsWith("http")) {
    return src;
  }
  return `${src}?w=${width}&q=${quality || 75}`;
};

const handleLoading = (
  img,
  onLoadRef,
  onLoadingCompleteRef,
  setBlurComplete,
  placeholder,
) => {
  if (!img || img["data-loaded-src"] === img.src) {
    return;
  }

  img["data-loaded-src"] = img.src;

  // Use decode() if available, fallback to Promise.resolve()
  const p = "decode" in img ? img.decode() : Promise.resolve();

  p.catch(() => {}).then(() => {
    if (!img.parentElement || !img.isConnected) {
      return;
    }

    if (placeholder === "blur") {
      setBlurComplete(true);
    }

    if (onLoadRef?.current) {
      const event = new Event("load");
      Object.defineProperty(event, "target", { writable: false, value: img });
      onLoadRef.current(event);
    }

    if (onLoadingCompleteRef?.current) {
      onLoadingCompleteRef.current(img);
    }
  });
};

const ImageElement = forwardRef(
  (
    {
      src,
      alt = "",
      width,
      height,
      className = "",
      style = {},
      fill = false,
      loader = defaultLoader,
      loading = "lazy",
      placeholder = "empty",
      blurDataURL = DEFAULT_BLUR_URL,
      sizes = "",
      quality,
      priority = false,
      onLoad,
      onLoadingComplete,
      onError,
      ...rest
    },
    forwardedRef,
  ) => {
    const [blurComplete, setBlurComplete] = useState(false);
    const [showAltText, setShowAltText] = useState(false);

    const onLoadRef = useRef(onLoad);
    const onLoadingCompleteRef = useRef(onLoadingComplete);

    // Handle image loading and errors
    const handleImageLoad = useCallback(
      (event) => {
        const img = event.currentTarget;
        handleLoading(
          img,
          onLoadRef,
          onLoadingCompleteRef,
          setBlurComplete,
          placeholder,
        );
      },
      [placeholder],
    );

    const handleImageError = useCallback(
      (event) => {
        setShowAltText(true);
        if (placeholder === "blur") {
          setBlurComplete(true);
        }
        if (onError) {
          onError(event);
        }
      },
      [onError, placeholder],
    );

    // Generate image attributes
    const imgAttributes = {
      src: loader({ src, width, quality }),
      width: width,
      height: height,
      "data-nimg": fill ? "fill" : "1",
      loading: priority ? undefined : loading,
      decoding: "async",
      style: {
        ...style,
        ...(fill
          ? {
              position: "absolute",
              height: "100%",
              width: "100%",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              objectFit: "cover",
            }
          : {}),
        ...(placeholder === "blur" && !blurComplete
          ? {
              filter: "blur(20px)",
              backgroundSize: "cover",
              backgroundImage: `url('${blurDataURL}')`,
            }
          : {}),
      },
      className,
      sizes: fill ? "100vw" : sizes,
      onLoad: handleImageLoad,
      onError: handleImageError,
      ref: forwardedRef,
      ...rest,
    };

    return <img alt={showAltText ? alt : ""} {...imgAttributes} />;
  },
);

ImageElement.displayName = "ImageElement";

const CustomImage = forwardRef((props, ref) => {
  const {
    src,
    alt,
    width,
    height,
    loader,
    quality,
    priority,
    loading,
    placeholder,
    blurDataURL,
    className,
    style,
    fill,
    sizes,
    onLoad,
    onLoadingComplete,
    onError,
    ...rest
  } = props;

  // Basic validation
  if (!src) {
    console.error('Image is missing required "src" property.');
    return null;
  }

  if (!alt) {
    console.warn(
      'Image is missing "alt" property. Please add alternative text for accessibility.',
    );
  }

  return (
    <ImageElement
      src={src}
      alt={alt}
      width={width}
      height={height}
      loader={loader}
      quality={quality}
      priority={priority}
      loading={loading}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      className={className}
      style={style}
      fill={fill}
      sizes={sizes}
      onLoad={onLoad}
      onLoadingComplete={onLoadingComplete}
      onError={onError}
      ref={ref}
      {...rest}
    />
  );
});

CustomImage.displayName = "CustomImage";

export { CustomImage as Image };

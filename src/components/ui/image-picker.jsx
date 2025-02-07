import { AnimatePresence, motion } from "framer-motion";
import { Image, RefreshCw, Trash2, Upload } from "lucide-react";
import PropTypes from "prop-types";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Enhanced Image Preview component with animations
const ImagePreview = ({ src, onRemove, isUploading, progress }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="relative"
  >
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-square w-full">
          <img
            src={src}
            alt="Assistant preview"
            className="h-full w-full object-cover"
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2 p-3">
                <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                <Progress value={progress} className="w-full" />
                <span className="text-xs text-muted-foreground">
                  {progress}%
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    {!isUploading && (
      <Button
        size="icon"
        variant="destructive"
        className="absolute -right-2 -top-2"
        onClick={onRemove}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    )}
  </motion.div>
);

ImagePreview.propTypes = {
  src: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  isUploading: PropTypes.bool,
  progress: PropTypes.number,
};

// Enhanced ImagePicker component
export const ImagePicker = ({
  src,
  onSrcChange,
  onImageChange,
  width = 200,
  height = 200,
}) => {
  const [previewSrc, setPreviewSrc] = useState(src);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const processImage = useCallback(async (file) => {
    if (file.size > 6000000) {
      toast.error("Image must be less than 6MB");
      return null;
    }

    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new window.Image();
      img.src = url;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          toast.error("Unable to process image");
          resolve(null);
          return;
        }

        // Create a square canvas using the smaller dimension
        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;

        // Draw the image centered in the square
        ctx.drawImage(
          img,
          (img.width - size) / 2,
          (img.height - size) / 2,
          size,
          size,
          0,
          0,
          size,
          size,
        );

        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };

      img.onerror = () => {
        toast.error("Failed to load image");
        resolve(null);
      };
    });
  }, []);

  const simulateUploadProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 95) {
        clearInterval(interval);
        progress = 100;
      }
      setUploadProgress(Math.min(Math.round(progress), 100));
    }, 200);

    return () => clearInterval(interval);
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      const processedImageUrl = await processImage(file);
      if (!processedImageUrl) {
        setIsProcessing(false);
        return;
      }

      // Start progress simulation
      const cleanup = simulateUploadProgress();

      // Update preview and notify parent
      setPreviewSrc(processedImageUrl);
      onSrcChange?.(processedImageUrl);
      onImageChange?.(file);

      // Cleanup and finish
      setTimeout(() => {
        cleanup();
        setIsProcessing(false);
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 500);
      }, 1500);
    } catch (error) {
      toast.error("Failed to process image");
      setIsProcessing(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewSrc("");
    onSrcChange?.("");
    onImageChange?.(null);
  };

  return (
    <div className="flex gap-6 w-full">
      <div className="w-18 flex-shrink-0">
        <AnimatePresence mode="wait">
          {previewSrc ? (
            <ImagePreview
              key="preview"
              src={previewSrc}
              onRemove={handleRemoveImage}
              isUploading={isProcessing}
              progress={uploadProgress}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="upload"
            >
              <Card
                className="relative aspect-square w-full flex items-center justify-center border-dashed hover:border-primary/50 transition-colors duration-200"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.add("border-primary");
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.remove("border-primary");
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.remove("border-primary");
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleImageSelect({ target: { files: [file] } });
                }}
              >
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleImageSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  tabIndex={-1}
                />
                <CardContent className="pointer-events-none flex flex-col items-center justify-center p-4 text-center">
                  <Image className="h-6 w-6 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Drop image here
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-3 min-w-[200px]">
        <div className="relative">
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleImageSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            tabIndex={-1}
          />
          <Button
            type="button"
            variant={previewSrc ? "outline" : "default"}
            className="relative pointer-events-none w-full md:w-auto"
          >
            <Upload className="mr-2 h-4 w-4" />
            {previewSrc ? "Change Image" : "Upload Image"}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          PNG, JPG or JPEG (MAX. 6MB)
        </p>
      </div>
    </div>
  );
};

ImagePicker.propTypes = {
  src: PropTypes.string,
  onSrcChange: PropTypes.func,
  onImageChange: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
};

ImagePicker.displayName = "ImagePicker";

export default ImagePicker;

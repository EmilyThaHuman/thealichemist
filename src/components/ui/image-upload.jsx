import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, X } from "lucide-react";
import PropTypes from "prop-types";
import { forwardRef, useState } from "react";
import { Image } from "./image";

export const ImageUpload = forwardRef(
  (
    { value, onChange, onRemove, disabled, progress = 0, className = "" },
    ref,
  ) => {
    const [preview, setPreview] = useState(value);
    const [error, setError] = useState(null);

    const handleFileChange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        // Create local preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Trigger actual file upload
        const uploadedPath = await onChange(file);
        if (!uploadedPath) {
          setPreview(value); // Revert to original if upload failed
          setError("Upload failed");
        }
      } catch (error) {
        console.error("Error processing image:", error);
        setError(error.message);
        setPreview(value); // Revert to original
      }
    };

    const handleRemove = () => {
      setPreview("");
      setError(null);
      onRemove();
    };

    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex flex-wrap items-center gap-4">
          <Input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
            disabled={disabled}
            ref={ref}
          />
          <Label htmlFor="image-upload" className="cursor-pointer">
            <Button type="button" variant="outline" disabled={disabled}>
              <Upload className="mr-2 h-4 w-4" />
              {disabled ? "Uploading..." : "Upload Image"}
            </Button>
          </Label>
          {preview && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="mr-2 h-4 w-4" />
              Remove
            </Button>
          )}
        </div>

        {progress > 0 && progress < 100 && (
          <Progress value={progress} className="w-full" />
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        {preview && (
          <div className="relative h-40 w-40 overflow-hidden rounded-lg border bg-muted">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              sizes="160px"
              placeholder="blur"
              blurDataURL={preview}
              onError={() => {
                setError("Error loading image");
                handleRemove();
              }}
            />
          </div>
        )}
      </div>
    );
  },
);

ImageUpload.displayName = "ImageUpload";

ImageUpload.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  progress: PropTypes.number,
  className: PropTypes.string,
};

export default ImageUpload;

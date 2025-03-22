
import { useRef, useEffect } from "react";

interface BoundingBoxProps {
  position: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  imageSize: {
    width: number;
    height: number;
  };
}

const BoundingBox = ({ position, imageSize }: BoundingBoxProps) => {
  const boxRef = useRef<HTMLDivElement>(null);

  // Calculate scaled box position based on image display size vs. original size
  useEffect(() => {
    const updateBoxPosition = () => {
      if (!boxRef.current || imageSize.width === 0 || imageSize.height === 0) return;

      const container = boxRef.current.parentElement;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // Calculate scale factors
      const scaleX = containerWidth / imageSize.width;
      const scaleY = containerHeight / imageSize.height;

      // Use the smaller scale to ensure the image fits fully within the container
      const scale = Math.min(scaleX, scaleY);

      // Calculate the size of the image after scaling
      const scaledWidth = imageSize.width * scale;
      const scaledHeight = imageSize.height * scale;

      // Calculate offsets to center the image
      const offsetX = (containerWidth - scaledWidth) / 2;
      const offsetY = (containerHeight - scaledHeight) / 2;

      // Calculate box position
      const left = position.x1 * scale + offsetX;
      const top = position.y1 * scale + offsetY;
      const width = (position.x2 - position.x1) * scale;
      const height = (position.y2 - position.y1) * scale;

      // Update box styles
      boxRef.current.style.left = `${left}px`;
      boxRef.current.style.top = `${top}px`;
      boxRef.current.style.width = `${width}px`;
      boxRef.current.style.height = `${height}px`;
    };

    updateBoxPosition();

    // Add resize event listener
    window.addEventListener("resize", updateBoxPosition);
    return () => window.removeEventListener("resize", updateBoxPosition);
  }, [position, imageSize]);

  return (
    <div
      ref={boxRef}
      className="absolute border-2 border-primary animate-pulse-subtle"
      style={{
        boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.5)",
      }}
    >
      <div className="absolute -top-7 left-0 bg-primary text-white text-xs px-2 py-1 rounded-sm whitespace-nowrap">
        Bird Nest
      </div>
    </div>
  );
};

export default BoundingBox;

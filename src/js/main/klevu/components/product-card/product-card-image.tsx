import React, { useEffect, useState } from "react";

import CardPlaceholder from "../../svgs/card-placeholder.svg";

type Props = {
  image: string;
  imageHover: string;
  imageOverride?: string;
};

const ProductCardImage: React.FC<Props> = ({
  image,
  imageHover,
  imageOverride,
}) => {
  const [activeImage, setActiveImage] = useState<string>(image);

  const handleMouseEnter = () => {
    if (imageHover.length > 0) setActiveImage(imageHover);
  };

  const handleMouseLeave = () => {
    setActiveImage(image);
  };

  useEffect(() => {
    // On a new search, ensure the image for the newly returned
    // product is the correct one for this index.
    setActiveImage(image);
  }, [image]);

  useEffect(() => {
    if (imageOverride && imageOverride.length > 0) {
      setActiveImage(imageOverride);
    } else {
      setActiveImage(image);
    }
  }, [imageOverride]);

  return image.length > 0 ? (
    <picture
      className="o-picture o-picture--fill aspect-[193_/_264]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        className="o-img js-lazyload animate-fade-in mix-blend-darken"
        src={activeImage}
        draggable={false}
        itemProp="image"
      />
    </picture>
  ) : (
    <CardPlaceholder className="aspect-[193_/_264] w-full bg-grey-90" />
  );
};

export default ProductCardImage;

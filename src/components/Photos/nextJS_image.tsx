import React, { useState } from "react";
import { Image } from "@nextui-org/react";
import type { RenderPhotoProps } from "react-photo-album";
import CircleIconButton from "@/components/Buttons/circle_icon_button";

type NextJsImageProps = RenderPhotoProps & {
  setPhotos: React.Dispatch<
    React.SetStateAction<
      {
        src: string;
        width: number;
        height: number;
      }[]
    >
  >;
  selectImage: (src: string) => void;
  selectImageMessage?: string;
};

const NextJsImage: React.FC<NextJsImageProps> = ({
  photo,
  imageProps: { alt, onClick },
  wrapperStyle,
  setPhotos,
  selectImage,
  selectImageMessage,
}) => {
  const { src } = photo as any;
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = (src: string) => {
    setPhotos((currentPhotos) =>
      currentPhotos.filter((photo) => photo.src !== src)
    );
  };

  return (
    <div className="relative hover:opacity-90 cursor-pointer p-2" style={{ ...wrapperStyle, position: "relative" }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Image src={src} alt={alt} width="100%" height="100%" onClick={onClick}/>
      <div className={`absolute right-0 top-0 z-20 max-md:opacity-100 max-md:visible transition-opacity duration-1000 ${isHovered ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <CircleIconButton
          circleSize={30}
          iconSize={22}
          circleColor="#ff5757"
          iconFileAddress="/icons/cross_white.svg"
          responsiveness={10}
          onClick={() => handleDelete(src)}
        />
      </div>
      <div className={`absolute left-0 top-0 z-20 max-md:opacity-100 max-md:visible transition-opacity duration-1000 ${isHovered ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <CircleIconButton
          circleSize={30}
          iconSize={22}
          circleColor="#ff5757"
          iconFileAddress="/icons/star.svg"
          onClick={() => selectImage(src)}
          messageToolTip={selectImageMessage}
          sizeMessage={16}
          placementToolTip="right"
          sizePaddingMessage={8}
        />
      </div>
    </div>
  );
};

export default NextJsImage;

/*
  const src = photo as any;

  const handleDelete = (src: string) => {
    setPhotos(currentPhotos => currentPhotos.filter(photo => photo.src !== src));
  };
  
  return (
    <div className="relative w-full h-full bg-yellow-500">
      <div
        className={`w-full h-full hover:opacity-80 cursor-pointer`}
        style={{ ...wrapperStyle, position: "relative" }}
      >
        <Image
          src={src}
          alt={alt}
          width="100%"
          height="100%"
          onClick={onClick}
        />
      </div>
    </div>
  );
};

*/
/*
const NextJsImage: React.FC<RenderPhotoProps> = ({photo,
    imageProps: { alt, onClick },
    wrapperStyle,}) => {
        const { src } = photo as any;

        return (
          <div className={`w-full h-fullhover:opacity-80 cursor-pointer`} style={{ ...wrapperStyle, position: "relative" }}>
            <Image
              src={src}
              alt={alt}
              width="100%"
              height="100%"
              onClick={onClick}
            />
          </div>
        );
  };
  */

import React, { useState, useEffect } from "react";
import PhotoAlbum from "react-photo-album";
import NextJsImage from "@/components/Photos/nextJS_image";
import type { RenderPhotoProps } from "react-photo-album";
import {Modal, ModalContent, useDisclosure, Image} from "@nextui-org/react";
import CircleIconButton from "@/components/Buttons/circle_icon_button";

type GalleryProps = {
  photos: {
    src: string;
    width: number;
    height: number;
  }[];
  setPhotos: React.Dispatch<React.SetStateAction<{
    src: string;
    width: number;
    height: number;
  }[]>>;
  selectImage: (src: string) => void;
  selectImageMessage?: string;
}

const Gallery: React.FC<GalleryProps> = ({photos, setPhotos, selectImage, selectImageMessage}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleClick = (index: number) => {
    setCurrentIndex(index);
    onOpen();
  };
  
  const renderPhoto = (photoProps: RenderPhotoProps) => (
    <NextJsImage
      {...photoProps}
      setPhotos={setPhotos}
      selectImage={selectImage}
      selectImageMessage={selectImageMessage}
    />
  );

  const goToNext = () => {
    if (currentIndex < photos.length - 1)
      setCurrentIndex(currentIndex + 1);
  };

  const goToPrev = () => {
    if (currentIndex > 0) 
      setCurrentIndex(currentIndex - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrev();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, goToNext, goToPrev]);

  return (
    <div className="w-full h-full">
      <div className="w-full flex-grow">
        {photos.length > 0 && (
          <PhotoAlbum
            layout="rows"
            photos={photos}
            renderPhoto={renderPhoto}
            targetRowHeight={160}
            onClick={({ index }) => handleClick(index)}
            rowConstraints={{
              singleRowMaxHeight: 300
            }}
            sizes={{ size: "calc(100vw - 240px)" }} // TODO: CHECK THIS VALUE
          />
        )}
      </div>
      {photos.length > 0 && (
        <Modal
          isOpen={isOpen}
          onClose={() => setCurrentIndex(0)} // avoid problem where Modal preload a image at index X but some photos where deletes so x become less than photos.length - 1 and trigger an error
          onOpenChange={onOpenChange}
          backdrop="blur"
          placement="center"
          style={{maxWidth: "95vw", maxHeight: "60vh"}}
          classNames={{
            base: "px-[40px] md:px-[50px] xl:px-[60px] w-fit h-fit border-none shadow-none bg-transparent",
            closeButton: "invisible z-20 bg-redWS hover:bg-redWS active:bg-redWS text-white hover:opacity-80 active:opacity-60",
          }}
        >
          <ModalContent className="flex flex-row justify-center items-center">
          <div className="z-20" style={{ position: "absolute", top: "50%", left: "0px", transform: "translateY(-50%)" }}>
              <CircleIconButton
                circleSize={50}
                iconSize={25}
                circleColor="#ff5757"
                iconFileAddress="/icons/left_arrow_white.svg"
                onClick={goToPrev}
                isDisabled={currentIndex == 0}
              />
            </div>
            <Image 
              src={photos[currentIndex].src} 
              style={{
                maxWidth: "95vw - 120px", 
                maxHeight: "60vh",
                objectFit: "contain",
              }} 
            />
            <div className="z-20" style={{ position: "absolute", top: "50%", right: "0px", transform: "translateY(-50%)" }}>
              <CircleIconButton
                circleSize={50}
                iconSize={25}
                circleColor="#ff5757"
                iconFileAddress="/icons/right_arrow_white.svg"
                onClick={goToNext}
                isDisabled={currentIndex == photos.length - 1}
              />
            </div>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};
export default Gallery;

import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";
import { useTranslations } from "next-intl";
import Gallery from "@/components/Photos/gallery";
import EventCard from "@/components/Cards/event_card";
import CircleIconButton from "@/components/Buttons/circle_icon_button";
import { Image as ImageUI, Tooltip } from "@nextui-org/react";
import {imagesType} from '@/type/formType';
import {imagesErrorType} from '@/type/formErrorType';

type DimensionCallback = (width: number, height: number) => void;

type ImageUploadAndCropProps = {
  images: imagesType;
  setImages: (value: imagesType) => void;
  disableChange?: boolean;
  errors: imagesErrorType;
};

const ImageUploadAndCrop: React.FC<ImageUploadAndCropProps> = ({
  images,
  setImages,
  errors,
}) => {
  const t = useTranslations("SelectionImage");
  const [isEditing, setIsEditing] = useState<boolean>(images.cover === ""); // put isEditing to true if the cover image is not yet set and the only possible action is to choose a first cover image.
  const [isHovered, setIsHovered] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<{ src: string; width: number; height: number }[]>([]);
  const imageElement = useRef<HTMLImageElement>(null);
  const cropperInstance = useRef<Cropper | null>(null);
  
  useEffect(() => { // Retreive the selectedPhotos from the input images (usefull if some initial photos are given)
    const preloadImages = async () => {
      if(images.cover !== ""){
        const imageSrcs = [images.cover, ...images.photos];
        const imagePromises = imageSrcs.map(src => 
          new Promise<{ src: string; width: number; height: number }>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ src, width: img.naturalWidth, height: img.naturalHeight });
            img.onerror = reject;
            img.src = src;
          })
        );
        const loadedImages = await Promise.all(imagePromises);
        setSelectedPhotos(loadedImages);
      }
    };

    preloadImages();
  }, []);

  const handleCoverChange = (newCover: string) => {
    setImages({...images, cover: newCover});
  };

  useEffect(() => {
    if (selectedPhotos.length > 0) { // Check if there is at least one additionnal photo (cover photo is the first of selectedPhotos) (Need to check from 0 because if not we don't remove the cover from the photo when previous cover deleted)
      const allPhotosSources = selectedPhotos.map(photo => photo.src);
      const newPhotos = allPhotosSources.slice(1); // Remove the src from the cover photo since it is already in images.cover
      setImages({...images, photos: newPhotos});
    }
  }, [selectedPhotos]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (files && files.length > 0) {
        const filteredFiles = Array.from(files).filter(file => file.type !== 'image/svg+xml');

        if (filteredFiles.length === 0) {
            alert("SVG files are not allowed.");
            return;
        }

        filteredFiles.forEach(file => {
            loadImageDimensions(file, (width, height) => {
                const src = URL.createObjectURL(file);
                setSelectedPhotos(prevPhotos => [...prevPhotos, { src, width, height }]);
            });
        });
    }
};

  const loadImageDimensions = (file: File, callback: DimensionCallback): void => {
      const img = new Image();
      img.onload = () => {
          const width = img.naturalWidth || img.width;
          const height = img.naturalHeight || img.height;
          callback(width, height);
          URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
  };

  const swapImageWithGallery = (selectedSrc: string) => {
    setIsEditing(true)
    handleCoverChange("")
    setSelectedPhotos(prevPhotos => {
      const selectedIndex = prevPhotos.findIndex(photo => photo.src === selectedSrc);
      if (selectedIndex > 0) {
        const newPhotos = [...prevPhotos];
        const [selectedPhoto] = newPhotos.splice(selectedIndex, 1);
        newPhotos.unshift(selectedPhoto);
        return newPhotos;
      }
      return prevPhotos;
    });
  };

  useEffect(() => {
    if (selectedPhotos.length > 0 && imageElement.current) {
      if (cropperInstance.current) {
        cropperInstance.current.replace(selectedPhotos[0].src);
      } else {
        cropperInstance.current = new Cropper(imageElement.current, {
          aspectRatio: 16 / 9,
          viewMode: 1,
          zoomable: false,
          autoCropArea: 1,
          background: false,
        });
      }
    }

    return () => {
      if (cropperInstance.current) {
        cropperInstance.current.destroy();
        cropperInstance.current = null;
      }
    };
  }, [selectedPhotos, isEditing]);

  const getCroppedImage = () => {
    cropperInstance.current?.getCroppedCanvas().toBlob((blob) => {
        if (!blob) return;
        const imageUrl = URL.createObjectURL(blob);
        handleCoverChange(imageUrl)
        setIsEditing(false);
        setIsHovered(false)
    });
};

  const handleDelete = () => {
    if (selectedPhotos.length > 0) {
      handleCoverChange("")
      setIsEditing(true);
      const newPhotos = selectedPhotos.slice(1);
      setSelectedPhotos(newPhotos);
    }
  };

  // define toolTipAddPhoto here so that I can place it depending on the value of photos.length (< 0, don't show / == 1 show next to cover title / > 1 show next additionnals photos)
  const toolTipAddPhoto = 
  <Tooltip
    color={"default"}
    placement={"left"}
    delay={300}
    content={
      <div
        className="font-bold"
        style={{
          fontSize: 18,
          padding: 10,
        }}
      >
        {t("upload")}
      </div>
    }
    >
    <label
      htmlFor="file-upload"
      style={{
        minWidth: "0",
        minHeight: "0",
        padding: "0",
        width: `38px`,
        height: `38px`,
        clipPath: "circle()",
      }}
      className="absolute right-0 top-0 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
    >
      <div className="w-full h-full flex justify-center items-center">
        <ImageUI
          alt="icon"
          src={"/icons/plus_white.svg"}
          height={25}
          width={25}
        />
      </div>
      <input
        id="file-upload"
        type="file"
        className="hidden"
        onChange={handleImageChange}
        multiple
      />
    </label>
    </Tooltip>

  return (
    <div className="relative w-full flex flex-col gap-5">
      <div className={`w-full flex flex-col shrink-0`}>
        {selectedPhotos.length > 0 && <div className="flex w-full justify-start items-start text-lg lg:text-xl xl:text-2xl font-semibold pb-1 sm:pb-2">
          {t("title_cover")}
        </div>}
        {selectedPhotos.length > 0 && <div className="flex w-full justify-start items-start text-sm lg:text-lg xl:text-xl font-light pb-1 sm:pb-4">
          {t("description_cover")}
        </div>}
        {errors?.cover && (
          <div className="w-full text-redError text-center text-sm font-bold">
            {errors.cover}
          </div>
        )}
        <div className="w-full flex">
          <div className={`w-full h-full flex py-2 justify-center ${((selectedPhotos.length > 0) && !isEditing) ? "md:max-w-[300px]" : ""}`}>
            {selectedPhotos.length > 0 ? (
              <button
                type="button"
                onClick={isEditing ? getCroppedImage : () => setIsEditing(true)}
                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer`}
              >
                {isEditing ? t("save") : t("resize")} 
              </button>
            ) : (
              <label
                htmlFor="file-upload"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
              >
                {t("upload")}
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  multiple
                />
              </label>
            )}
          </div>
        </div>
        <div className="w-full h-full flex justify-center md:justify-start overflow-hidden pt-2">
          {selectedPhotos.length > 0 &&
            (isEditing ? (
              <img
                ref={imageElement}
                src={selectedPhotos[0].src}
                alt="Source"
                className="max-h-[400px]"
              />
            ) : (
              <div
                className="relative w-[300px] h-[300px]"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <EventCard
                  title={t("example_title")}
                  description={t("example_description")}
                  date={new Date()}
                  image={images.cover!}
                  displayButton={false}
                  onPress={() => {}}
                />
                <div className={`absolute right-0 top-0 z-20 max-md:opacity-100 max-md:visible transition-opacity duration-1000 ${isHovered ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                  <CircleIconButton
                    circleSize={30}
                    iconSize={22}
                    circleColor="#ff5757"
                    iconFileAddress="/icons/cross_white.svg"
                    responsiveness={10}
                    onClick={() => handleDelete()}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
      {errors?.photos && (
          <div className="w-full text-redError text-center text-sm font-bold pb-4">
            {errors.photos}
          </div>
        )}
      {(selectedPhotos.length > 1) && <div className="relative w-full flex-col flex-grow">
        <div className="flex w-full justify-start items-start text-lg lg:text-xl xl:text-2xl font-semibold pb-1 sm:pb-2">
          {t("title_more")}
        </div>
        <div className="flex w-full justify-start items-start text-sm lg:text-lg xl:text-xl font-light pb-1 sm:pb-4">
          {t("description_more")}
        </div>
        <Gallery photos={selectedPhotos.slice(1)} setPhotos={setSelectedPhotos} selectImage={(imageCover) => swapImageWithGallery(imageCover)} selectImageMessage={t("select")}/>
        {selectedPhotos.length > 1 && (toolTipAddPhoto)}
      </div>}
      {selectedPhotos.length == 1 && (toolTipAddPhoto)}
    </div>
  );
};

export default ImageUploadAndCrop;

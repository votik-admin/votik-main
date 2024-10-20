"use client";

import React, { FC, useEffect, useId, useMemo, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import NextPrev from "@app/shared/NextPrev/NextPrev";
import ButtonClose from "@app/shared/ButtonClose/ButtonClose";
import Glide from "@glidejs/glide";
import NcImage from "@app/shared/NcImage/NcImage";

export interface ModalPhotosProps {
  imgs: string[];
  uniqueClassName: string;
}

const ModalPhotos: FC<ModalPhotosProps> = ({ imgs, uniqueClassName = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openFocusIndex, setOpenFocusIndex] = useState(0);

  const handleOpenModal = (index: number) => {
    setIsOpen(true);
    setOpenFocusIndex(index);
  };
  const handleCloseModal = () => setIsOpen(false);

  const id = useId();
  const UNIQUE_CLASS = "glidejs" + id.replace(/:/g, "_");
  let completeButtonRef = useRef(null);

  let MY_GLIDEJS = useMemo(() => {
    return new Glide(`.${UNIQUE_CLASS}`, {
      direction: "ltr",
      // direction: document?.querySelector("html")?.getAttribute("dir") === "rtl" ? "rtl" : "ltr",
      gap: 10,
      perView: 1,
      startAt: openFocusIndex,
    });
  }, [UNIQUE_CLASS, openFocusIndex]);

  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => {
      MY_GLIDEJS.mount();
    }, 10);
  }, [MY_GLIDEJS, isOpen, UNIQUE_CLASS]);

  const renderSlider = () => {
    return (
      <div
        className={`modalPhotos-single-gallery ${UNIQUE_CLASS} group relative flex flex-col z-50 w-full h-full`}
      >
        {/*  */}
        <div
          className="controls_nav glide__bullets mb-4"
          data-glide-el="controls[nav]"
        >
          {imgs.map((_, index) => (
            <div key={index} className="text-center hidden text-sm">
              <span className="text-xl font-semibold"> {index + 1}</span>
              <span> / {imgs.length}</span>
            </div>
          ))}
        </div>
        {/*  */}

        <div
          className="glide__track max-h-full h-full relative z-50"
          data-glide-el="track"
        >
          <ul className="glide__slides h-full">
            {imgs.map((item, index) => (
              <li className="glide__slide relative h-full" key={index}>
                <NcImage
                  src={item}
                  containerClassName=" w-full h-full flex items-center justify-center"
                  // rounded-2xl can be removed
                  // though above div can't be vertically centered without h-full
                  // skill issue
                  className=" max-w-full max-h-full rounded-2xl"
                />
              </li>
            ))}
          </ul>
        </div>
        {/*  */}
        <div className="xl:absolute z-20 xl:-inset-x-20 max-w-6xl my-2 mx-auto top-full xl:top-1/2 transform xl:-translate-y-1/2 flex xl:justify-between glide__arrows">
          <NextPrev
            onlyPrev
            className="mr-1.5"
            btnClassName="w-8 h-8 sm:w-10 sm:h-10 "
          />
          <NextPrev
            onlyNext
            className="ml-1.5"
            btnClassName="w-8 h-8 sm:w-10 sm:h-10 "
          />
        </div>
      </div>
    );
  };

  const renderModalPhotos = () => {
    return (
      <div>
        <header className="container 2xl:px-14 rounded-md sm:rounded-xl">
          <div className="relative grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2">
            <div
              className="col-span-2 row-span-3 sm:row-span-2 relative rounded-md sm:rounded-xl overflow-hidden cursor-pointer"
              onClick={() => handleOpenModal(0)}
            >
              <NcImage
                containerClassName="absolute inset-0"
                className="object-cover w-full h-full rounded-md sm:rounded-xl"
                src={imgs[0]}
              />
              <div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity"></div>
            </div>
            {imgs
              .filter((_, i) => i >= 1 && i < 5)
              .map((item, index) => (
                <div
                  key={index}
                  className={`relative rounded-md sm:rounded-xl overflow-hidden ${
                    index >= 3 ? "hidden sm:block" : ""
                  }`}
                >
                  <NcImage
                    containerClassName="aspect-w-4 aspect-h-3 sm:aspect-w-6 sm:aspect-h-5"
                    className="object-cover w-full h-full rounded-md sm:rounded-xl "
                    src={item || ""}
                  />

                  {/* OVERLAY */}
                  <div
                    className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => handleOpenModal(index + 1)}
                  />
                </div>
              ))}

            <div
              className="absolute hidden md:flex md:items-center md:justify-center left-3 bottom-3 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-500 cursor-pointer hover:bg-neutral-200 z-10"
              onClick={() => handleOpenModal(0)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              <span className="ml-2 text-neutral-800 text-sm font-medium">
                Show all photos
              </span>
            </div>
          </div>
        </header>
        <Dialog
          initialFocus={completeButtonRef}
          as="div"
          className="ProductDetailModalPhotos fixed inset-0 z-50 overflow-y-auto dark bg-neutral-800 text-neutral-200 hiddenScrollbar"
          onClose={handleCloseModal}
          open={isOpen}
        >
          <div className="min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-white dark:bg-neutral-800" />
            <div
              ref={completeButtonRef}
              className="absolute right-2 top-2 md:top-4 md:right-4 z-50"
            >
              <ButtonClose
                className=" sm:w-12 sm:h-12"
                onClick={handleCloseModal}
              />
            </div>
            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="relative inline-block w-full max-w-5xl py-5 sm:py-8 h-screen align-middle mx-auto">
              {renderSlider()}
            </div>
          </div>
        </Dialog>
      </div>
    );
  };

  return renderModalPhotos();
};

export default ModalPhotos;

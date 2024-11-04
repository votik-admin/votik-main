import { Dialog, Tab, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import React, { Fragment, useState } from "react";
import StaySearchForm from "./StaySearchForm";
import { useTimeoutFn } from "react-use";

const HeroSearchForm2Mobile = () => {
  const [showModal, setShowModal] = useState(false);

  // FOR RESET ALL DATA WHEN CLICK CLEAR BUTTON
  const [showDialog, setShowDialog] = useState(false);
  let [, , resetIsShowingDialog] = useTimeoutFn(() => setShowDialog(true), 1);
  //
  function closeModal() {
    setShowModal(false);
  }

  function openModal() {
    setShowModal(true);
  }

  const renderButtonOpenModal = () => {
    return (
      <button
        onClick={openModal}
        id="open_search_modal_mobile"
        className="relative flex items-center w-full border border-neutral-200 dark:border-neutral-6000 px-4 py-2 pr-11 rounded-full shadow-lg"
      >
        <MagnifyingGlassIcon className="flex-shrink-0 w-5 h-5" />

        <div className="ml-3 flex-1 text-left overflow-hidden">
          <span className="block font-medium text-sm">
            What do you want to see live?
          </span>
          <span className="block mt-0.5 text-xs font-light text-neutral-500 dark:text-neutral-400 line-clamp-1">
            Anywhere • Any week • Any event
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="HeroSearchForm2Mobile">
      {renderButtonOpenModal()}
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="HeroSearchFormMobile__Dialog relative z-max"
          onClose={closeModal}
        >
          <div className="fixed inset-0 bg-neutral-100 dark:bg-neutral-900">
            <div className="flex h-full">
              <Transition.Child
                as={Fragment}
                enter="ease-out transition-transform"
                enterFrom="opacity-0 translate-y-52"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in transition-transform"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-52"
              >
                <Dialog.Panel className="relative h-full overflow-hidden flex-1 flex flex-col justify-between ">
                  {showDialog && (
                    <Tab.Group manual>
                      <div className="absolute left-4 top-4">
                        <button className="" onClick={closeModal}>
                          <XMarkIcon className="w-5 h-5 text-black dark:text-white" />
                        </button>
                      </div>

                      <Tab.List className="pt-12 flex w-full justify-center font-semibold text-sm sm:text-base text-neutral-500 dark:text-neutral-400 space-x-6 sm:space-x-8">
                        {["Search"].map((item, index) => (
                          <Tab key={index} as={Fragment}>
                            {({ selected }) => (
                              <div className="relative focus:outline-none focus-visible:ring-0 outline-none select-none">
                                <div
                                  className={`${
                                    selected ? "text-black dark:text-white" : ""
                                  }  `}
                                >
                                  {item}
                                </div>
                                {selected && (
                                  <span className="absolute inset-x-0 top-full border-b-2 border-black dark:border-white"></span>
                                )}
                              </div>
                            )}
                          </Tab>
                        ))}
                      </Tab.List>
                      <div className="flex-1 pt-3 px-1 flex overflow-hidden">
                        <Tab.Panels className="flex-1 overflow-y-auto py-4">
                          <Tab.Panel>
                            <div className="transition-opacity animate-[myblur_0.4s_ease-in-out]">
                              <StaySearchForm closeModal={closeModal} />
                            </div>
                          </Tab.Panel>
                        </Tab.Panels>
                      </div>
                    </Tab.Group>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default HeroSearchForm2Mobile;

"use client";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { DateRage } from "@app/components/HeroSearchForm/StaySearchForm";
import { GuestsObject } from "@app/components/HeroSearchForm2Mobile/GuestsInput";
import CheckOutPage from "@app/containers/CheckOutPage/CheckOutPage";
import React, { FC, Fragment, useState } from "react";
import SectionChoseTicket from "./book/SectionChoseTicket";
import { Tables } from "@app/types/database.types";
import { User } from "@supabase/supabase-js";

interface ModalReserveMobileProps {
  tickets?: Tables<"tickets">[];
  event_id?: string;
  user: User;
  onClose?: () => void;
  renderChildren?: (p: { openModal: () => void }) => React.ReactNode;
}

const ModalReserveMobile: FC<ModalReserveMobileProps> = ({
  tickets,
  event_id,
  user,
  onClose,
  renderChildren,
}) => {
  const [showModal, setShowModal] = useState(false);
  function closeModal() {
    setShowModal(false);
  }

  function openModal() {
    setShowModal(true);
  }

  const renderButtonOpenModal = () => {
    return renderChildren ? (
      renderChildren({ openModal })
    ) : (
      <button onClick={openModal}>Select Date</button>
    );
  };

  return (
    <>
      {renderButtonOpenModal()}
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="HeroSearchFormMobile__Dialog relative z-50"
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
                <Dialog.Panel className="relative h-full flex-1 flex flex-col justify-between overflow-auto">
                  <>
                    <div className="absolute left-4 top-4">
                      <button
                        className="focus:outline-none focus:ring-0"
                        onClick={closeModal}
                      >
                        <XMarkIcon className="w-5 h-5 text-black dark:text-white" />
                      </button>
                    </div>

                    <div className="flex-1 pt-12 flex flex-col">
                      <div className="flex-1 bg-white dark:bg-neutral-900 px-4">
                        {tickets && (
                          <SectionChoseTicket
                            user={user}
                            tickets={tickets}
                            event_id={event_id}
                          />
                        )}
                      </div>
                    </div>
                  </>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ModalReserveMobile;

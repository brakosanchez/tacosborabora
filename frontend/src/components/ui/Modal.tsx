import { useState } from 'react';
import { Dialog } from '@headlessui/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all">
          <Dialog.Title className="text-lg font-semibold mb-4">
            {title}
          </Dialog.Title>
          
          <div className="space-y-4">
            {children}
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              onClick={onClose}
              className="btn btn-primary"
            >
              Aceptar
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

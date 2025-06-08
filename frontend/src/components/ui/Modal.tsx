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
      <div className="fixed inset-0 bg-black/70" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md transform rounded-lg bg-[#1a120b] border border-yellow-900 p-6 shadow-xl transition-all">
          <Dialog.Title className="text-lg font-semibold mb-4 text-yellow-100">
            {title}
          </Dialog.Title>
          
          <div className="space-y-4 text-yellow-100">
            {children}
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-700 text-yellow-100 hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-yellow-500 text-[#1a120b] hover:bg-yellow-400 transition-colors font-medium"
            >
              Aceptar
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

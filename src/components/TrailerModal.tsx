import * as Dialog from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';

 const TrailerModal = ({ trailerUrl, onClose, movieTitle }: { trailerUrl: string, onClose: () => void, movieTitle?: string }) => {
  return (
    <Dialog.Root open={!!trailerUrl} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-10" />
        <Dialog.Content className="fixed inset-1/4 w-3/4 md:w-1/2 bg-white p-10 rounded-lg z-50">
        <Dialog.Title className="absolute top-2 left-2 text-lg font-bold text-gray-800">{movieTitle}</Dialog.Title>
          <Dialog.Close className="absolute top-2 right-2 text-xl font-bold text-gray-900">
            <XIcon />
          </Dialog.Close>
          <div className="relative w-full h-full">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerUrl}`}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default TrailerModal;
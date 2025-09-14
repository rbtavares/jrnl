import { PlusIcon } from 'lucide-react';

interface AddNewButtonProps {
  onClick: () => void;
}

export default function AddNewButton({ onClick }: AddNewButtonProps) {
  return (
    <button onClick={onClick} className="bg-blue-500 text-white px-3 py-2 rounded-md flex items-center gap-1">
      <PlusIcon className="size-5" />
      Add New
    </button>
  );
}

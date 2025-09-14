interface NoteCardProps {
  id: number;
  title: string;
  content: string;
  edited: Date;
}

export default function NoteCard({ id, title, content, edited }: NoteCardProps) {
  return (
    <div
      className="bg-neutral-50 rounded-md py-3.5 px-4 border border-neutral-200 flex flex-col shadow-md"
      onClick={() => {}}
    >
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-neutral-500 flex-1 text-justify">{content}</p>
      <p className="text-sm text-neutral-400 mt-4">
        {edited.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </p>
    </div>
  );
}

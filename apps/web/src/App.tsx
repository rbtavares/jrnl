import AddNewButton from './components/AddNewButton';
import NoteCard from './components/NoteCard';

function App() {
  return (
    <div className="w-full flex flex-col items-center max-w-screen-lg p-4 mx-auto gap-4">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-4xl font-medium">JRNL</h1>
        <AddNewButton onClick={() => {}} />
      </div>

      <main className="w-full grid grid-cols-3 grid-rows-5 gap-4 aspect-[5/5]">
        <NoteCard id={1} title="Note 1" content="Note 1 content" edited={new Date()} />
        <NoteCard id={2} title="Note 2" content="Note 2 content" edited={new Date()} />
        <NoteCard id={3} title="Note 3" content="Note 3 content" edited={new Date()} />
        <NoteCard id={4} title="Note 4" content="Note 4 content" edited={new Date()} />
        <NoteCard id={5} title="Note 5" content="Note 5 content" edited={new Date()} />
      </main>
    </div>
  );
}

export default App;

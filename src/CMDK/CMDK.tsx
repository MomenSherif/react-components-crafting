import { Command } from 'cmdk';
import { useEffect, useState } from 'react';

const items = Array.from({ length: 50 }, (_, idx) => `Item ${idx + 1}`);

export default function CMDK() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(''); // controlled active value
  const [search, setSearch] = useState(''); // controlled search

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        setOpen(open => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    // <Command
    <Command.Dialog
      onOpenChange={setOpen}
      open={open}
      label="Global Command Menu"
      value={value}
      onValueChange={v => setValue(v || '')}
      loop
      className="bg-gray-900 text-white rounded-lg shadow-lg max-w-2xl mx-auto"
    >
      <Command.Input
        className="bg-transparent outline-none p-4 border-b border-b-gray-700 w-full"
        value={search}
        onValueChange={setSearch}
        placeholder="Search for ..."
      />

      <Command.List className="p-4 h-[var(--cmdk-list-height)] max-h-[300px] overflow-y-auto transition-all duration-300 scroll-p-4">
        {/* {isLoading && <Command.Loading>Hang on…</Command.Loading>} */}

        <Command.Empty>No results found.</Command.Empty>

        <Command.Group
          heading={<p className="text-2xl font-medium mb-1">Fruits</p>}
        >
          {items.map(item => (
            // if value not provided it will use .textContent
            <Command.Item
              key={item}
              value={item}
              className="px-4 py-2 rounded-md my-2 last:mb-0 first:mt-0 cursor-pointer aria-selected:bg-gray-800"
              onSelect={v => {
                alert(`Selected ${v}`);
                setOpen(false);
              }}
            >
              {item}
            </Command.Item>
          ))}
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}

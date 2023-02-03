import { useSelect } from 'downshift';

const books = [
  { author: 'Harper Lee', title: 'To Kill a Mockingbird' },
  { author: 'Lev Tolstoy', title: 'War and Peace' },
  { author: 'Fyodor Dostoyevsy', title: 'The Idiot' },
  { author: 'Oscar Wilde', title: 'A Picture of Dorian Gray' },
  { author: 'George Orwell', title: '1984' },
  { author: 'Jane Austen', title: 'Pride and Prejudice' },
  { author: 'Marcus Aurelius', title: 'Meditations' },
  { author: 'Fyodor Dostoevsky', title: 'The Brothers Karamazov' },
  { author: 'Lev Tolstoy', title: 'Anna Karenina' },
  { author: 'Fyodor Dostoevsky', title: 'Crime and Punishment' },
];

const itemToString = (item: typeof books[number] | null) => {
  return item?.title || '';
};

export default function SelectDownshift() {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items: books,
    itemToString,
  });

  return (
    <div className="w-72 relative">
      <div className="flex flex-col gap-2">
        <label {...getLabelProps()} className="text-gray-800">
          Choose your favorite book:
        </label>
        <div
          {...getToggleButtonProps()}
          className="px-3 py-2 bg-white flex justify-between cursor-pointer border rounded-md focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
        >
          <span>{selectedItem ? selectedItem.title : 'Elements'}</span>
          <span className="px-2">{isOpen ? <>&#8593;</> : <>&#8595;</>}</span>
        </div>
      </div>

      <ul
        {...getMenuProps()}
        className={`absolute top-full mt-2 py-1 rounded-md shadow-md max-h-80 overflow-y-auto w-full divide-y divide-gray-100 ${
          isOpen && books.length ? '' : 'hidden'
        }`}
      >
        {isOpen &&
          books.map((item, index) => (
            <li
              key={`${item.title}${index}`}
              {...getItemProps({ item, index })}
              className={`px-3 py-2  flex flex-col ${
                highlightedIndex === index ? 'bg-gray-100' : ''
              } ${selectedItem === item ? 'font-medium' : ''}`}
            >
              <span>{item.title}</span>
              <span className="text-sm text-gray-700">{item.author}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}

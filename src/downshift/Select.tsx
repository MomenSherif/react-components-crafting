import {
  useSelect,
  UseSelectState,
  UseSelectStateChangeOptions,
} from 'downshift';
import { useState } from 'react';

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
type Book = typeof books[number];

const itemToString = (item: Book | null) => {
  return item?.title || '';
};

function stateReducer(
  state: UseSelectState<Book>,
  actionAndChanges: UseSelectStateChangeOptions<Book>,
) {
  const { changes, type } = actionAndChanges;
  switch (type) {
    case useSelect.stateChangeTypes.ToggleButtonKeyDownEnter:
    case useSelect.stateChangeTypes.ToggleButtonKeyDownEscape:
    case useSelect.stateChangeTypes.ItemClick:
      return {
        ...changes,
        isOpen: true, // keep menu open after selection.
        highlightedIndex: state.highlightedIndex,
      };
    default:
      return changes;
  }
}

export function SelectDownshiftMultiple() {
  const [selectedItems, setSelectedItems] = useState<Book[]>([]);

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items: books,
    itemToString,
    selectedItem: null,
    onSelectedItemChange: ({ selectedItem }) => {
      if (!selectedItem) return;

      const index = selectedItems.indexOf(selectedItem);

      // not found
      if (index === -1) {
        setSelectedItems(prev => [...prev, selectedItem]);
        // first item
      } else if (index === 0) {
        setSelectedItems(prev => prev.slice(1));
        // in the middle
      } else {
        setSelectedItems(prev => [
          ...prev.slice(0, index),
          ...prev.slice(index + 1),
        ]);
      }
    },
    stateReducer,
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
          <span>
            {selectedItems.length
              ? `${selectedItems.length} elements selected`
              : 'Elements'}
          </span>
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
              {...getItemProps({
                item,
                index,
                'aria-selected': selectedItems.includes(item),
              })}
              className={`px-3 py-2  flex flex-col ${
                highlightedIndex === index ? 'bg-gray-100' : ''
              } ${selectedItems.includes(item) ? 'font-medium' : ''}`}
            >
              <span>{item.title}</span>
              <span className="text-sm text-gray-700">{item.author}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default function SelectDownshift() {
  const [selectedItem, setSelectedItem] = useState<Book | null | undefined>(
    null,
  );

  const {
    isOpen,
    // selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items: books,
    itemToString,
    selectedItem,
    onSelectedItemChange: ({ selectedItem }) => {
      setSelectedItem(selectedItem);
    },
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

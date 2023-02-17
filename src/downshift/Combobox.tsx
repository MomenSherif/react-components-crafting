import { useCombobox } from 'downshift';
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

const getBooksFilter = (inputValue?: string) => {
  return function bookFilter(book: Book) {
    return (
      !inputValue ||
      book.title.toLowerCase().includes(inputValue.toLowerCase()) ||
      book.author.toLowerCase().includes(inputValue.toLowerCase())
    );
  };
};

type Book = typeof books[number];

export default function SingleComboBox() {
  const [items, setItems] = useState(books);

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    onInputValueChange: ({ inputValue }) =>
      setItems(books.filter(getBooksFilter(inputValue))),
    items,
    itemToString: item => item?.title || '',
  });

  console.log(selectedItem);

  return (
    <div className="relative w-72">
      <div className="flex flex-col space-y-1">
        <label className="w-fit" {...getLabelProps()}>
          Choose your favorite book:
        </label>
        <div className="relative">
          <input
            placeholder="Best book ever"
            className="w-full px-3 py-2 pr-10 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            {...getInputProps()}
          />
          <button
            aria-label="toggle menu"
            className="absolute flex justify-center items-center w-10 right-0 top-0 bottom-0 border border-transparent rounded-md bg-transparent bg-clip-padding hover:bg-indigo-200/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            type="button"
            {...getToggleButtonProps()}
          >
            {isOpen ? <>&#8593;</> : <>&#8595;</>}
          </button>
        </div>
      </div>

      <ul
        className="absolute w-full bg-white mt-1 shadow-lg py-1 divide-y divide-gray-100"
        {...getMenuProps()}
      >
        {isOpen &&
          items.map((item, index) => (
            <li
              key={`${item.title}${index}`}
              className={`px-3 py-2 flex flex-col ${
                highlightedIndex === index ? 'bg-gray-100' : ''
              } ${selectedItem === item ? 'font-bold' : ''}`}
              {...getItemProps({ item, index })}
            >
              <span>{item.title}</span>
              <span className="text-sm text-gray-500">{item.author}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}

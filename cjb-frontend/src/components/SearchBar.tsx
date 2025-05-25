import React from "react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearchSubmit: () => void; // Or (event: React.FormEvent) => void if using a form
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent page reload if it's part of a form
    onSearchSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex justify-center">
      <input
        type="text"
        placeholder="Search by keyword (e.g., React, Node, Senior)..."
        value={searchTerm}
        onChange={handleInputChange}
        className="w-full md:w-1/2 lg:w-1/3 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:border-transparent"
        style={{
          borderColor: "var(--color-primary)",
          background: "var(--color-white)",
          color: "var(--color-black)",
        }}
      />
      <button
        type="submit"
        className="px-6 py-2 rounded-r-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition"
        style={{
          background: "var(--color-primary)",
          color: "var(--color-white)",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.background = "var(--color-primary-light)")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.background = "var(--color-primary)")
        }
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;

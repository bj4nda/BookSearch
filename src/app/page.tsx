"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Book {
  id: number;
  title: string;
  author: string;
  image: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async () => {
    const query = searchQuery.trim();
    if (!query) {
      setError("Please enter a search term");
      return;
    }

    setError(null);
    setIsLoading(true);
    setHasSearched(true);

    try {
      console.log("Searching for:", query);
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error("Search failed. Please try again.");
      }
      const data = await response.json();
      console.log("Search results:", data);
      setBooks(data.books);
    } catch (error) {
      console.error("Error searching books:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while searching"
      );
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Book Search</h1>
          <p className="text-gray-600">Discover your next favorite book</p>
        </div>

        <div className="flex gap-4 mb-12 max-w-2xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setError(null);
            }}
            onKeyPress={handleKeyPress}
            placeholder="Search for books by title or author..."
            className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hasSearched && !isLoading && books.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No books found</p>
              <p className="text-gray-400 mt-2">Try a different search term</p>
            </div>
          )}

          {books.map((book) => (
            <Link
              key={book.id}
              href={`/book/${book.id}`}
              className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-32 relative overflow-hidden rounded">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                    {book.title}
                  </h2>
                  <p className="text-gray-600 mt-1">{book.author}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/add-book"
            className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Book
          </Link>
        </div>
      </div>
    </main>
  );
}

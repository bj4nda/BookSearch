"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddBook() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAmazonUrl = (url: string) => {
    const amazonMediaPattern =
      /^https:\/\/m\.media-amazon\.com\/images\/(?:I|G\/\d+\/pv_starlight)\/.*\.(jpg|jpeg|png)(?:\?.*)?$/i;
    return amazonMediaPattern.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Amazon media URL
    if (!validateAmazonUrl(formData.image)) {
      setError(
        "Please enter a valid Amazon media image URL (e.g., https://m.media-amazon.com/images/I/... or https://m.media-amazon.com/images/G/...)"
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/");
      } else {
        throw new Error("Failed to add book");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      setError("An error occurred while adding the book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <a
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to search
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Add New Book
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Share your favorite books with the community
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="Enter book title"
              />
            </div>

            <div>
              <label
                htmlFor="author"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Author
              </label>
              <input
                type="text"
                id="author"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="Enter author name"
              />
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cover Image URL
              </label>
              <input
                type="url"
                id="image"
                value={formData.image}
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.value });
                  setError(null);
                }}
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="Enter Amazon media image URL (e.g., https://m.media-amazon.com/images/I/... or https://m.media-amazon.com/images/G/...)"
              />
              <p className="mt-2 text-sm text-gray-500">
                Only Amazon media URLs are accepted (e.g.,
                https://m.media-amazon.com/images/I/... or
                https://m.media-amazon.com/images/G/...)"
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200"
            >
              {isSubmitting ? "Adding Book..." : "Add Book"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

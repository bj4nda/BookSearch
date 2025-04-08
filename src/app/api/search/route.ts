import { NextResponse } from "next/server";
import booksData from "@/data/books.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase().trim() || "";

  console.log("Search query:", query);
  console.log("Total books:", booksData.books.length);

  if (!query) {
    return NextResponse.json({ books: [] });
  }

  const filteredBooks = booksData.books.filter((book) => {
    const titleMatch = book.title.toLowerCase().includes(query);
    const authorMatch = book.author.toLowerCase().includes(query);
    return titleMatch || authorMatch;
  });

  console.log("Filtered books:", filteredBooks);

  return NextResponse.json({ books: filteredBooks });
}

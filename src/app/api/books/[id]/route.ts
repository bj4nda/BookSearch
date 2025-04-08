import { NextResponse } from "next/server";
import booksData from "@/data/books.json";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the ID from the URL path
    const id = request.url.split("/").pop();
    const bookId = id ? parseInt(id) : NaN;

    if (isNaN(bookId)) {
      return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
    }

    const book = booksData.books.find((b) => b.id === bookId);

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ book });
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

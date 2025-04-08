import { NextResponse } from "next/server";
import booksData from "@/data/books.json";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const newBook = await request.json();

    // Generate a new ID
    const newId = Math.max(...booksData.books.map((b) => b.id)) + 1;

    const bookToAdd = {
      id: newId,
      ...newBook,
    };

    // Add the new book to the array
    booksData.books.push(bookToAdd);

    // Write the updated data back to the file
    const filePath = path.join(process.cwd(), "src", "data", "books.json");
    fs.writeFileSync(filePath, JSON.stringify(booksData, null, 2));

    return NextResponse.json({ book: bookToAdd }, { status: 201 });
  } catch (error) {
    console.error("Error adding book:", error);
    return NextResponse.json({ error: "Failed to add book" }, { status: 500 });
  }
}

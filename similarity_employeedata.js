const { ChromaClient, DefaultEmbeddingFunction } = require("chromadb");
const client = new ChromaClient();
const default_emd = new DefaultEmbeddingFunction();
const collectionName = "book_collection_new";

async function main() {
  try {
    const collection = await client.getOrCreateCollection({
      name: collectionName,
      embeddings: default_emd,
    });

    const books = [
        {
          id: "book_1",
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          genre: "Classic",
          year: 1925,
          rating: 4.1,
        },
        {
          id: "book_2",
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          genre: "Classic",
          year: 1960,
          rating: 4.3,
        },
        {
          id: "book_3",
          title: "1984",
          author: "George Orwell",
          genre: "Dystopian",
          year: 1949,
          rating: 4.4,
        },
        {
          id: "book_4",
          title: "The Catcher in the Rye",
          author: "J.D. Salinger",
          genre: "Literary Fiction",
          year: 1951,
          rating: 4.0,
        },
        {
          id: "book_5",
          title: "Pride and Prejudice",
          author: "Jane Austen",
          genre: "Romance",
          year: 1813,
          rating: 4.2,
        },
        {
          id: "book_6",
          title: "Harry Potter and the Philosopher's Stone",
          author: "J.K. Rowling",
          genre: "Fantasy",
          year: 1997,
          rating: 4.5,
        },
        {
          id: "book_7",
          title: "The Lord of the Rings",
          author: "J.R.R. Tolkien",
          genre: "Fantasy",
          year: 1954,
          rating: 4.5,
        },
        {
          id: "book_8",
          title: "The Hitchhiker's Guide to the Galaxy",
          author: "Douglas Adams",
          genre: "Science Fiction",
          year: 1979,
          rating: 4.2,
        },
        {
          id: "book_9",
          title: "Frankenstein",
          author: "Mary Shelley",
          genre: "Gothic",
          year: 1818,
          rating: 4.0,
        },
        {
          id: "book_10",
          title: "The Hunger Games",
          author: "Suzanne Collins",
          genre: "Dystopian",
          year: 2008,
          rating: 4.2,
        },
      ];

    const bookExperiences = books.map((book) =>
      // book.experience.toString()
    book.rating.toString()
    );
    const embeddingsData = await default_emd.generate(bookExperiences);
    await collection.add({
      ids: books.map((book) => book.id),
      bookNames: books.map((book) => book.name),
      documents: books.map((book) => book.rating.toString()),
      embeddings: embeddingsData,
    });
    const allItems = await collection.get();
    console.log(allItems);
    await performSimilaritySearch(collection, allItems);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function performSimilaritySearch(collection, allItems) {
  console.log("AllItems===>", allItems);
  try {
    const queryTerm = "4.2";
    const results = await collection.query({
      collection: collectionName,
      queryTexts: [queryTerm],
      n: 3,
    });
    console.log("Here is result ===>", results);
    if (!results || results.length === 0) {
      console.log(`No books found with experience similar to ${queryTerm}`);
      return;
    }
    const queryTermScore = results.distances[0][0]; 
    console.log(`Score for query term "${queryTerm}": ${queryTermScore}`);
    console.log(`Top 3 books with experience similar to ${queryTerm}:`);
    for (let i = 0; i < 3; i++) {
      const id = results.ids[0][i]; // Get ID from 'ids' array
      const score = results.distances[0][i]; // Get score from 'distances' array

      const book = allItems.documents.find((emp) => emp.id === id);
      if (!book) {
        console.log(` - ID: ${id}, Score: ${score}`);
      } else {
        console.log(
          ` - ID: ${book.id}, Name: '${book.name}', Experience: ${book.experience}, Score: ${score}`
        );
      }
    }
  } catch (error) {
    console.error("Error during similarity search:", error);
  }
}

main();
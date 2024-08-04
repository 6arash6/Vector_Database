const { ChromaClient, DefaultEmbeddingFunction } = require('chromadb');
const collectionName = "my_array_grocery";
 
 async function main() {
   try {
     const client = new ChromaClient();
     const default_emd = new DefaultEmbeddingFunction(); 
 
     const texts = [
       'fresh red apples',
       'organic bananas',
       'ripe mangoes',
       'whole wheat bread',
       'farm-fresh eggs',
       'natural yogurt',
       'frozen vegetables',
       'grass-fed beef',
       'free-range chicken',
       'fresh salmon eggs fillet',
       'aromatic coffee beans',
       'pure honey',
       'golden apple',
       'red fruit'
     ];
    const ids = texts.map((_, index) => `document_${index + 1}`); 
 
    const collection = await client.getOrCreateCollection({
       name: collectionName,
       embeddings: default_emd
     });
     const embeddingsData = await default_emd.generate(texts);
     await collection.add({ ids, documents: texts, embeddings: embeddingsData }); 
     const allItems = await collection.get();
     console.log(allItems);
 
    await performSimilaritySearch(collection, allItems);
   } catch (error) {
     console.error("Error:", error);
   }
 }
 
 async function performSimilaritySearch(collection, allItems) {
   try {
     // const queryTerm="red"
     const queryTerm = ["eggs", "fresh"]; 
     const queryString = queryTerm.join(" AND ");
 
     const results = await collection.query({
       collection: collectionName,
       queryTexts: queryString, 
       n: 3
     });
 
     console.log('results',results);
     if (!results || results.length === 0) {
       console.log(`No documents found similar to "${queryTerm}"`);
       return; 
     }
     console.log(`Top 3 similar documents to "${queryTerm}":`);
     for (let i = 0; i < 3; i++) {
       const id = results.ids[0][i];
       const score = results.distances[0][i];
 
       const text = allItems.documents[allItems.ids.indexOf(id)];
 
       if (!text) {
         console.log(` - ID: ${id}, Text: 'Text not available', Score: ${score}`);
       } else {
         console.log(` - ID: ${id}, Text: '${text}', Score: ${score}`);
       }
     }
   } catch (error) {
     console.error("Error during similarity search:", error);
   }
 }
 
 main();
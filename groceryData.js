const { ChromaClient } = require('chromadb');
const client = new ChromaClient();

async function groceryMain() {
    try {

        const collection = await client.getOrCreateCollection({
            name: "groceries"
        });

        const groceryItems=[
            "Milk","Chicken","Curd","Butter","Bread"
        ]
        const ids = groceryItems.map((_, index) => `document_${index + 1}`);
        await collection.add({ ids: ids, documents: groceryItems });
        const allItems = await collection.get();
        console.log("All items in the 'groceries' collection:", allItems);
    } catch (error) {
        console.error("Error:", error);
    } 
}

groceryMain();
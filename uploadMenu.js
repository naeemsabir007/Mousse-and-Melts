// uploadMenu.js - Firebase Database Reset Script
// Run with: node uploadMenu.js

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// Firebase Configuration (same as services/firebase.ts)
const firebaseConfig = {
    apiKey: "AIzaSyAhPYjDxUd4LxD-WX2YdF-SwQunv16Vs1Y",
    authDomain: "mousse-and-melts.firebaseapp.com",
    projectId: "mousse-and-melts",
    storageBucket: "mousse-and-melts.firebasestorage.app",
    messagingSenderId: "507558640024",
    appId: "1:507558640024:web:9d558ffd4495134e5993ed",
    measurementId: "G-RJ66JF206Q"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

// Menu Data - Strictly as provided
const MENU_DATA = [
    // Cupcakes
    { name: "Oreo Cupcake", price: 250, category: "Cupcakes", description: "Soft chocolate cupcake with creamy Oreo frosting.", image: "https://placehold.co/400x400/3E2723/FFF?text=Oreo+Cupcake" },
    { name: "Red Velvet Cupcake", price: 250, category: "Cupcakes", description: "Velvety cupcake with cream cheese frosting.", image: "https://placehold.co/400x400/800020/FFF?text=Red+Velvet" },
    { name: "Fudge Cupcake", price: 250, category: "Cupcakes", description: "Filled with soft fudge and rich chocolate frosting.", image: "https://placehold.co/400x400/3E2723/FFF?text=Fudge+Cupcake" },

    // Pastries & Brownies
    { name: "Molten Lava", price: 350, category: "Pastries", description: "Warm chocolate cake with a flowing center.", image: "https://placehold.co/400x400/3E2723/FFF?text=Molten+Lava" },
    { name: "Hazel Brownie", price: 300, category: "Pastries", description: "Fudgy brownie blended with roasted hazelnuts.", image: "https://placehold.co/400x400/3E2723/FFF?text=Hazel+Brownie" },
    { name: "Fudge Pastry", price: 350, category: "Pastries", description: "Layered with rich fudge and smooth frosting.", image: "https://placehold.co/400x400/3E2723/FFF?text=Fudge+Pastry" },
    { name: "Caramel Pastry", price: 350, category: "Pastries", description: "Layered with smooth caramel cream.", image: "https://placehold.co/400x400/D2691E/FFF?text=Caramel+Pastry" },

    // Breads & Tarts
    { name: "Chocolate Bread", price: 300, category: "Breads", description: "Fluffy bread infused with rich chocolate.", image: "https://placehold.co/400x400/3E2723/FFF?text=Choco+Bread" },
    { name: "Banana Bread", price: 300, category: "Breads", description: "Moist bread made with ripe bananas.", image: "https://placehold.co/400x400/FFD700/000?text=Banana+Bread" },
    { name: "Chocolate Tart", price: 300, category: "Tarts", description: "Crisp buttery crust filled with smooth ganache.", image: "https://placehold.co/400x400/3E2723/FFF?text=Choco+Tart" },
    { name: "Lemon Tart", price: 300, category: "Tarts", description: "Zesty tangy lemon curd filling.", image: "https://placehold.co/400x400/FFFACD/000?text=Lemon+Tart" },
    { name: "Mini Puffs", price: 100, category: "Pastries", description: "Light airy pastry bites with cream.", image: "https://placehold.co/400x400/FFF/000?text=Mini+Puffs" },

    // Sundaes
    { name: "Nutella Sundae", price: 350, category: "Sundaes", description: "Layers of ice cream, Nutella and crunchy toppings.", image: "https://placehold.co/400x400/3E2723/FFF?text=Nutella+Sundae" },
    { name: "Red Velvet Sundae", price: 350, category: "Sundaes", description: "Layers of red velvet cake and ice cream.", image: "https://placehold.co/400x400/800020/FFF?text=Red+Velvet+Sundae" },
    { name: "Tres Leches", price: 380, category: "Sundaes", description: "Sponge cake soaked in three types of milk.", image: "https://placehold.co/400x400/FFF/000?text=Tres+Leches" }
];

// Main function to reset and seed database
async function resetDatabase() {
    console.log("Starting Database Reset...");

    try {
        // Step 1: Clear Old Data
        console.log("Clearing existing products...");
        const productsRef = db.collection("products");
        const snapshot = await productsRef.get();

        let deleteCount = 0;
        for (const doc of snapshot.docs) {
            await doc.ref.delete();
            deleteCount++;
        }
        console.log(`Deleted ${deleteCount} existing products.`);

        // Step 2: Seed New Data
        console.log("Uploading new products...");
        let uploadCount = 0;
        for (const item of MENU_DATA) {
            // Generate a deterministic ID from the product name
            const productId = item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
            await productsRef.doc(productId).set({
                ...item,
                id: productId,
                isBestSeller: false
            });
            uploadCount++;
            console.log(`  ✓ Added: ${item.name} (ID: ${productId})`);
        }

        console.log(`\nSuccess! All ${uploadCount} products uploaded.`);
        process.exit(0);
    } catch (error) {
        console.error("Error during database reset:", error);
        process.exit(1);
    }
}

// Run the script
resetDatabase();

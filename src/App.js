import React, { useState, useEffect } from "react";
import BarcodeScanner from "./BarcodeScanner";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  update,
} from "firebase/database";

// Din Firebase-konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyBJcVAtpl7kFM9E1dFA41D7Q-n1XFeN-TY",
  authDomain: "inventory-app-39d9c.firebaseapp.com",
  databaseURL:
    "https://inventory-app-39d9c-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "inventory-app-39d9c",
  storageBucket: "inventory-app-39d9c.appspot.com",
  messagingSenderId: "186067025808",
  appId: "1:186067025808:web:d74f0c4d0998b613febd15",
};

// Initiera Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function App() {
  const [inventory, setInventory] = useState({});
  const [lastScan, setLastScan] = useState("");

  // Lyssna på ändringar i inventeringen
  useEffect(() => {
    const invRef = ref(db, "inventory");
    onValue(invRef, (snapshot) => {
      const data = snapshot.val() || {};
      setInventory(data);
    });
  }, []);

  // Lägg till ett item i inventeringen
  const addToInventory = (itemName) => {
    const currentCount = inventory[itemName]?.count || 0;
    const itemRef = ref(db, `inventory/${itemName}`);
    update(itemRef, { count: currentCount + 1 });
  };

  // Ta bort ett item från inventeringen
  const removeOneItem = (itemName) => {
    const currentCount = inventory[itemName]?.count || 0;
    const itemRef = ref(db, `inventory/${itemName}`);
    if (currentCount > 1) {
      update(itemRef, { count: currentCount - 1 });
    } else {
      update(itemRef, { count: 0 });
    }
  };

  // När en streckkod skannas
  const handleScan = (data) => {
    setLastScan(data);
    addToInventory(data);
    alert(`Skannad kod: ${data}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📦 Inventering - Webb</h1>
      <BarcodeScanner onScan={handleScan} />
      <h2>Senast skannad: {lastScan}</h2>
      <h2>Inventering</h2>
      <ul>
        {Object.entries(inventory).map(([item, info]) => (
          <li key={item}>
            {item}: {info.count}{" "}
            <button onClick={() => removeOneItem(item)}>Ta bort 1</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

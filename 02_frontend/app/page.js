"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const API = process.env.NEXT_PUBLIC_API_HOST + "/items";

  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
  });

  const loadItems = async () => {
    const res = await fetch(API);
    setItems(await res.json());
  };

  useEffect(() => {
    loadItems();
  }, []);

  const save = async () => {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", description: "", price: 0, quantity: 0 });
    loadItems();
  };

  const remove = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadItems();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Item Manager</h1>

      <h2>Add New Item</h2>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <br />

      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <br />

      <input
        placeholder="Price"
        type="number"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
      />
      <br />

      <input
        placeholder="Quantity"
        type="number"
        value={form.quantity}
        onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
      />
      <br />

      <button onClick={save}>Add Item</button>

      <hr />

      <h2>Items</h2>
      {items.map((item) => (
        <div key={item.id} style={{ marginBottom: 10 }}>
          <b>{item.name}</b> — {item.description} — {item.price}฿ — {item.quantity}pcs
          <button style={{ marginLeft: 10 }} onClick={() => remove(item.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

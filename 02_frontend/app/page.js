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
  const [editingId, setEditingId] = useState(null);

  // โหลดข้อมูล items
  const loadItems = async () => {
    const res = await fetch(API);
    setItems(await res.json());
  };

  useEffect(() => {
    loadItems();
  }, []);

  // เพิ่ม item
  const save = async () => {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", description: "", price: 0, quantity: 0 });
    loadItems();
  };

  // ลบ item
  const remove = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadItems();
  };

  // เริ่มแก้ไข item
  const edit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
    });
  };

  // อัปเดต item โดยไม่เปลี่ยน id
  const update = async () => {
    await fetch(`${API}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", description: "", price: 0, quantity: 0 });
    setEditingId(null);
    loadItems();
  };

  const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-title-wrapper">
          <h1 className="title">📦 Item Manager</h1>
        </div>
      </header>

      {/* Stats */}
      <div className="stats-card">
        <div className="stats-mini">
          <div className="stat-box">
            <div className="stat-value">{items.length}</div>
            <div className="stat-label">รายการ</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{totalItems}</div>
            <div className="stat-label">ชิ้น</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{totalValue.toLocaleString()}</div>
            <div className="stat-label">บาท</div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="form-card">
        <div className="form-header">
          <h2>จัดการสินค้าและคลังสินค้าของคุณ</h2>
        </div>
        <div className="form-subheader">
          <h3>{editingId ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</h3>
        </div>

        <div className="form-grid">
          <div className="full">
            <label className="label">ชื่อสินค้า</label>
            <input
              className="input"
              placeholder="เช่น Laptop, Mouse, Keyboard"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="full">
            <label className="label">รายละเอียด</label>
            <input
              className="input"
              placeholder="รายละเอียดเพิ่มเติม"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <label className="label">ราคา (฿)</label>
            <input
              className="input"
              placeholder="0.00"
              type="number"
              value={form.price || ""}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="label">จำนวน</label>
            <input
              className="input"
              placeholder="0"
              type="number"
              value={form.quantity || ""}
              onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* ปุ่มบันทึกและยกเลิก */}
        <button className="btn" onClick={editingId ? update : save}>
          {editingId ? "✏️ บันทึก" : "➕ เพิ่มสินค้า"}
        </button>
        {editingId && (
          <button
            className="btn btn-cancel"
            style={{ marginLeft: "8px" }}
            onClick={() => {
              setForm({ name: "", description: "", price: 0, quantity: 0 });
              setEditingId(null);
            }}
          >
            ❌ ยกเลิก
          </button>
        )}
      </div>

      {/* Items List */}
      <div>
        <div className="list-header">
          <h2>รายการสินค้า</h2>
          <span className="badge">{items.length} รายการ</span>
        </div>

        {items.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📭</div>
            <div className="empty-title">ยังไม่มีสินค้า</div>
            <div className="empty-text">เริ่มต้นเพิ่มสินค้าด้านบนได้เลย</div>
          </div>
        ) : (
          <div className="list">
            {items.map((item) => (
              <div key={item.id} className="card">
                <div className="card-head">
                  <div className="card-title">{item.name}</div>
                  <div className="badge">{item.quantity} ชิ้น</div>
                </div>
                <div className="card-meta">{item.description}</div>
                <div className="card-price">
                  <div className="price-tag">฿{item.price.toLocaleString()}</div>
                  <div className="price-total">
                    มูลค่า: ฿{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
                <div className="card-actions">
                  <button className="btn btn-edit" onClick={() => edit(item)}>
                    ✏️ แก้ไขสินค้า
                  </button>
                  <button className="btn btn-delete" onClick={() => remove(item.id)}>
                    🗑️ ลบ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

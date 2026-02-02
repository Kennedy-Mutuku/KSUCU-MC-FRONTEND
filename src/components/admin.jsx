import { useState } from "react";
import "./admin.css";

function Admin() {
  const [boards, setBoards] = useState([
    { id: "ict", title: "ICT Board", description: "", image: null },
    { id: "editorial", title: "Editorial Board", description: "", image: null },
    { id: "communication", title: "Communication Board", description: "", image: null },
    { id: "media", title: "Media Board", description: "", image: null },
  ]);

  const handleChange = (id, field, value) => {
    setBoards((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, [field]: value } : b
      )
    );
  };

  const handleImageUpload = (id, file) => {
    const imageUrl = URL.createObjectURL(file);
    handleChange(id, "image", imageUrl);
  };

  return (
    <div className="admin-dashboard">
      <h2>Boards Admin Panel</h2>

      {boards.map((board) => (
        <div className="admin-card" key={board.id}>
          <h3>{board.title}</h3>

          <textarea
            placeholder="Board description"
            value={board.description}
            onChange={(e) =>
              handleChange(board.id, "description", e.target.value)
            }
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageUpload(board.id, e.target.files[0])
            }
          />

          {board.image && (
            <img
              src={board.image}
              alt={board.title}
              className="preview-image"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default Admin;

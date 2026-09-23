"use client";

import { useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
  deleted: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const activeTodos = todos.filter((t) => !t.deleted);
  const trashedTodos = todos.filter((t) => t.deleted);

  function handleAddTask(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    if (newTask.trim() === "") return;
    setTodos([
      ...todos,
      { id: Date.now(), text: newTask, completed: false, deleted: false },
    ]);
    setNewTask("");
  }

  function toggleComplete(id: number) {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function startEditing(todo: Todo) {
    setEditingId(todo.id);
    setEditingText(todo.text);
  }

  function saveEdit(id: number) {
    setTodos(
      todos.map((t) =>
        t.id === id && editingText.trim() !== "" ? { ...t, text: editingText } : t
      )
    );
    setEditingId(null);
  }

  function deleteTask(id: number) {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, deleted: true } : t))
    );
  }

  function restoreTask(id: number) {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, deleted: false } : t))
    );
  }

  function deleteForever(id: number) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  return (
    <div className="todo-container">
      <h1 className="todo-title">Mis tareas</h1>
      <hr className="todo-divider" />

      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyDown={handleAddTask}
        placeholder="Escribe una tarea y presiona Enter"
        className="todo-new-input"
      />

      <p>
        Total de Tareas: {activeTodos.length}
      </p>

      <p style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
        {totalCount === 0
          ? "No hay tareas"
          : `${completedCount} de ${totalCount} actividades completadas`}
      </p>

      <ul className="todo-list">
        {activeTodos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <input
              type="checkbox"
              className="todo-checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id)}
            />

            {editingId === todo.id ? (
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onBlur={() => saveEdit(todo.id)}
                autoFocus
                className="todo-edit-input"
              />
            ) : (
              <span
                onClick={() => startEditing(todo)}
                className={todo.completed ? "todo-text todo-text--done" : "todo-text"}
              >
                {todo.text}
              </span>
            )}

            <button className="todo-delete-btn" onClick={() => deleteTask(todo.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {trashedTodos.length > 0 && (
        <div className="trash-container">
          <h2 className="trash-title">Papelera</h2>
          <ul className="trash-list">
            {trashedTodos.map((todo) => (
              <li key={todo.id} className="trash-item">
                <span className="trash-task">
                  {todo.text}
                </span>
                <button
                  className="restore-button"
                  onClick={() => restoreTask(todo.id)}
                >
                  Restaurar
                </button>

                <button
                  className="delete-button"
                  onClick={() => deleteForever(todo.id)}
                >
                  Borrar definitivo
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("accessToken"))
  );
  const [editMode, setEditMode] = useState(false);
  const [editTodoId, setEditTodoId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
      navigate("/");
    } else {
      fetchTodos();
    }

    const timeout = setTimeout(() => {
      localStorage.removeItem("accessToken");
      setLoggedIn(false);
      navigate("/");
    }, 290000); // 290 seconds = 290,000 milliseconds

    return () => clearTimeout(timeout); // Cleanup the timeout on component unmount
  }, [loggedIn, navigate]);

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:3000/todos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();
      console.log(data);
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const createTodo = async () => {
    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({title, description}),
      });
      if (response.ok) {
        const data = await response.json();
        setTodos([...todos, data]);
        setTitle("");
        setDescription("");
      } else {
        console.error("Failed to create todo:", response.status);
      }
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const updateTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({title, description}),
      });
      if (response.ok) {
        const updatedTodo = {id, title, description};
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? updatedTodo : todo
        );
        setTodos(updatedTodos);
        setTitle("");
        setDescription("");
        setEditMode(false);
        setEditTodoId(null);
      } else {
        console.error("Failed to update todo:", response.status);
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response.ok) {
        const filteredTodos = todos.filter((todo) => todo.id !== id);
        setTodos(filteredTodos);
      } else {
        console.error("Failed to delete todo:", response.status);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const startEditTodo = (id) => {
    const todoToEdit = todos.find((todo) => todo.id === id);
    if (todoToEdit) {
      setTitle(todoToEdit.title);
      setDescription(todoToEdit.description);
      setEditMode(true);
      setEditTodoId(id);
    }
  };

  const cancelEditTodo = () => {
    setTitle("");
    setDescription("");
    setEditMode(false);
    setEditTodoId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8">Todos</h1>
        <ul>
          {loggedIn &&
            todos.map((todo) => (
              <li key={todo.id} className="mb-4">
                {editMode && editTodoId === todo.id ? (
                  <div className="mb-4">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="border rounded py-2 px-4 w-full"
                    />
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="border rounded py-2 px-4 w-full"
                    />
                    <button
                      onClick={() => updateTodo(todo.id)}
                      className="bg-indigo-600 text-white py-2 px-4 rounded mr-2"
                    >
                      Update
                    </button>
                    <button
                      onClick={cancelEditTodo}
                      className="bg-gray-400 text-white py-2 px-4 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <div>
                      <span className="font-bold">{todo.title}</span> -{" "}
                      {todo.description}
                    </div>
                    <div>
                      <button
                        onClick={() => startEditTodo(todo.id)}
                        className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="bg-red-500 text-white py-2 px-4 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
        </ul>
        {!editMode && (
          <form className="mt-8">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded py-2 px-4 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded py-2 px-4 w-full mb-2"
            />
            <button
              type="button"
              onClick={createTodo}
              className="bg-indigo-600 text-white py-2 px-4 rounded"
            >
              Create
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default TodoList;

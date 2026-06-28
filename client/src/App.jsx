import { useState, useEffect, useCallback } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Notification from "./components/Notification";
import { getTasks, createTask, updateTask, deleteTask } from "./api/tasks";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "success" });

  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterPriority) params.priority = filterPriority;
      if (sortBy) params.sort = sortBy;
      const res = await getTasks(params);
      setTasks(res.data);
    } catch (err) {
      showNotification(err.message || "Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterPriority, sortBy]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingTask) {
        const res = await updateTask(editingTask._id, formData);
        setTasks((prev) => prev.map((t) => (t._id === res.data._id ? res.data : t)));
        showNotification("Task updated successfully", "success");
        setEditingTask(null);
      } else {
        const res = await createTask(formData);
        setTasks((prev) => [res.data, ...prev]);
        showNotification("Task added successfully", "success");
      }
    } catch (err) {
      showNotification(err.message || "Something went wrong", "error");
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      showNotification("Task deleted", "success");
      if (editingTask?._id === id) setEditingTask(null);
    } catch (err) {
      showNotification(err.message || "Failed to delete task", "error");
    }
  };

  const handleToggleStatus = async (id, status) => {
    try {
      const res = await updateTask(id, { status });
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
      showNotification("Status updated", "success");
    } catch (err) {
      showNotification(err.message || "Failed to update status", "error");
    }
  };

  const taskCounts = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
  };

  return (
    <div className="app">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "success" })}
      />

      <header className="app-header">
        <h1>Task Tracker</h1>
        <p className="subtitle">Stay on top of what matters</p>
        <div className="stats-bar">
          <div className="stat">
            <span className="stat-number">{taskCounts.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat">
            <span className="stat-number">{taskCounts.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat">
            <span className="stat-number">{taskCounts.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat">
            <span className="stat-number">{taskCounts.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <TaskForm
          onSubmit={handleCreateOrUpdate}
          editingTask={editingTask}
          onCancelEdit={() => setEditingTask(null)}
        />

        <TaskList
          tasks={tasks}
          loading={loading}
          onEdit={setEditingTask}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </main>

      <footer className="app-footer">
        <p>Task Tracker — MERN Stack Assignment</p>
      </footer>
    </div>
  );
}

export default App;

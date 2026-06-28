import { useState, useEffect } from "react";

const initialState = {
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  dueDate: "",
};

export default function TaskForm({ onSubmit, editingTask, onCancelEdit }) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || "",
        description: editingTask.description || "",
        status: editingTask.status || "pending",
        priority: editingTask.priority || "medium",
        dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : "",
      });
      setErrors({});
    } else {
      setForm(initialState);
    }
  }, [editingTask]);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    } else if (form.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (form.title.trim().length > 100) {
      newErrors.title = "Title cannot exceed 100 characters";
    }

    if (form.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }

    if (form.dueDate) {
      const selected = new Date(form.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (!editingTask && selected < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        dueDate: form.dueDate || null,
      });
      setForm(initialState);
      setErrors({});
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{editingTask ? "Edit Task" : "Add New Task"}</h2>

      <div className="form-group">
        <label htmlFor="title">
          Title <span className="required">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Finish project report"
          className={errors.title ? "input-error" : ""}
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Add details about this task (optional)"
          rows={3}
          className={errors.description ? "input-error" : ""}
        />
        {errors.description && <span className="error-text">{errors.description}</span>}
        <span className="char-count">{form.description.length}/500</span>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={form.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            className={errors.dueDate ? "input-error" : ""}
          />
          {errors.dueDate && <span className="error-text">{errors.dueDate}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : editingTask ? "Update Task" : "Add Task"}
        </button>
        {editingTask && (
          <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

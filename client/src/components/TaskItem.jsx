export default function TaskItem({ task, onEdit, onDelete, onToggleStatus }) {
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const isOverdue =
    task.dueDate && task.status !== "completed" && new Date(task.dueDate) < new Date(new Date().toDateString());

  return (
    <div className={`task-card priority-${task.priority} status-${task.status}`}>
      <div className="task-card-header">
        <h3 className={task.status === "completed" ? "task-title-done" : ""}>{task.title}</h3>
        <span className={`badge badge-${task.priority}`}>{task.priority}</span>
      </div>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-meta">
        <span className={`status-pill status-pill-${task.status}`}>{task.status.replace("-", " ")}</span>
        {formattedDate && (
          <span className={`due-date ${isOverdue ? "overdue" : ""}`}>
            Due: {formattedDate} {isOverdue && "(Overdue)"}
          </span>
        )}
      </div>

      <div className="task-actions">
        <select
          value={task.status}
          onChange={(e) => onToggleStatus(task._id, e.target.value)}
          className="status-select"
          aria-label="Change status"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button className="btn btn-small btn-edit" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn btn-small btn-delete" onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

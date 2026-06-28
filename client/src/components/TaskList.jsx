import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  loading,
  onEdit,
  onDelete,
  onToggleStatus,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="task-list-section">
      <div className="filters-bar">
        <div className="filter-group">
          <label htmlFor="filterStatus">Status</label>
          <select id="filterStatus" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filterPriority">Priority</label>
          <select id="filterPriority" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sortBy">Sort by</label>
          <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="dueDate">Due Date</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="info-text">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="info-text">No tasks found. Add one above to get started!</p>
      ) : (
        <div className="task-grid">
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}

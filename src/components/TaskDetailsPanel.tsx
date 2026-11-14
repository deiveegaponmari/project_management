import { useEffect, useState } from 'react';
import { addTaskComment, updateTaskStatus } from '../services/taskApi';

interface TaskDetailsPanelProps {
  task: any;
  onRefresh: () => void;
}

export default function TaskDetailsPanel({ task, onRefresh }: TaskDetailsPanelProps) {
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState(task?.status || 'backlog');

  useEffect(() => {
    setStatus(task?.status || 'backlog');
  }, [task?.id, task?.status]);

  if (!task) {
    return <div className="details-empty">Select a task to view details.</div>;
  }

  const handleStatusChange = async (nextStatus: string) => {
    try {
      await updateTaskStatus(task.id, { status: nextStatus });
      setStatus(nextStatus);
      onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      const projectId = task.projectId || task.project?._id || task.project;
      await addTaskComment(task.id, {
        text: comment,
        project: projectId,
      });
      setComment('');
      onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="details-panel">
      <h3>{task.title}</h3>
      <p>{task.description}</p>

      <div className="details-grid">
        <div>
          <span>Assignee</span>
          <strong>{task.assignee}</strong>
        </div>
        <div>
          <span>Due Date</span>
          <strong>{task.dueDate || 'No due date'}</strong>
        </div>
        <div>
          <span>Priority</span>
          <strong>{task.priority}</strong>
        </div>
        <div>
          <span>Status</span>
          <select value={status} onChange={(e) => handleStatusChange(e.target.value)}>
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      <div className="comment-box">
        <h4>Comments</h4>
        <div className="comment-list">
          {(task.comments || []).map((item: string, index: number) => (
            <div key={`${item}-${index}`} className="comment-item">{item}</div>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button type="button" className="primary-btn" onClick={handleAddComment}>Post Comment</button>
      </div>
    </div>
  );
}

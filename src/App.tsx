import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { store } from './store/store';
import type { RootState } from './store/store';
import KanbanBoard from './components/KanbanBoard';
import BacklogTable from './components/BacklogTable';
import AuthPage from './components/AuthPage';
import TaskDetailsPanel from './components/TaskDetailsPanel';
import { fetchTasks, createTask } from './services/taskApi';
import { setTasks } from './store/tasksSlice';
import './App.css';

function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [selectedTask, setSelectedTask] = useState<any>(tasks[0] ?? null);
  const [taskTitle, setTaskTitle] = useState('');
const [taskDescription, setTaskDescription] = useState('');
const [taskStatus, setTaskStatus] = useState('backlog');

const [taskProject, setTaskProject] = useState('6a8054090a681292a88fcb35');

const [taskAssignee, setTaskAssignee] = useState('6a8053c30a681292a88fcb2e');

const [taskPriority, setTaskPriority] = useState('medium');

const [taskDueDate, setTaskDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('taskflow_token')) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!tasks.length) return;
    setSelectedTask((prev: any) => prev ?? tasks[0]);
  }, [tasks]);

  const ensureTasksLoaded = async () => {
    try {
      setLoading(true);
      const loadedTasks = await fetchTasks();
      dispatch(setTasks(loadedTasks));
      setSelectedTask((prev: any) => {
        if (!prev) return loadedTasks[0] ?? null;
        return loadedTasks.find((task: any) => task.id === prev.id) ?? loadedTasks[0] ?? null;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void ensureTasksLoaded();
  }, []);

  const handleCreateTask = async () => {
  if (!taskTitle.trim()) return;

  try {
    await createTask({
      title: taskTitle,
      project: taskProject,
      assignee: taskAssignee || null,
       dueDate: taskDueDate || null,
      priority: taskPriority,
      status: taskStatus,
      description: taskDescription,
    });

    setTaskTitle('');
    setTaskProject("");
      setTaskAssignee('');
       setTaskDueDate('');
       setTaskPriority('');
        setTaskStatus('');
    setTaskDescription('');
     await ensureTasksLoaded();
  } catch (error) {
    console.error(error);
  }
};
  const handleLogout = () => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="workspace-heading">
          <div className="workspace-mark" aria-hidden="true">T</div>
          <div>
            <p className="eyebrow">Project workspace</p>
            <h1>TaskFlow Manager</h1>
            <p className="workspace-caption">Plan clearly. Keep your team moving.</p>
          </div>
        </div>
        <div className="topbar-actions">
          <span className="workspace-label">Workspace overview</span>
          <button className="secondary-btn" type="button" onClick={handleLogout}>Log out</button>
        </div>
      </header>

      <section className="summary-cards">
        <div className="card metric-card metric-total">
          <span className="metric-label">Total tasks</span>
          <strong>{tasks.length}</strong>
          <span className="metric-note">Across your workspace</span>
        </div>
        <div className="card metric-card metric-progress">
          <span className="metric-label">In progress</span>
          <strong>{tasks.filter((task) => task.status === 'in-progress').length}</strong>
          <span className="metric-note">Work currently moving</span>
        </div>
        <div className="card metric-card metric-review">
          <span className="metric-label">In review</span>
          <strong>{tasks.filter((task) => task.status === 'review').length}</strong>
          <span className="metric-note">Ready for a closer look</span>
        </div>
        <div className="card metric-card metric-complete">
          <span className="metric-label">Completed</span>
          <strong>{tasks.filter((task) => task.status === 'done').length}</strong>
          <span className="metric-note">Finished tasks</span>
        </div>
      </section>

      <section className="task-form panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Make progress</p>
            <h2>Create a task</h2>
          </div>
          <p className="section-hint">Add the details now; update the status as work moves forward.</p>
        </div>
      {/*   <div className="task-form-grid">
          <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="Task title" />
          <input value={taskAssignee} onChange={(e) => setTaskAssignee(e.target.value)} placeholder="Assignee" />
          <input type="date" value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} />
          <select value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)}>
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div> */}
        <div className="task-form-grid">

  {/* Task Title */}
  <input
    value={taskTitle}
    onChange={(e) => setTaskTitle(e.target.value)}
    placeholder="Task title"
  />

  {/* Project */}
  <select
    value={taskProject}
    onChange={(e) => setTaskProject(e.target.value)}
  >
    <option value="">Select Project</option>

    <option value="6a8054090a681292a88fcb35">
      TaskFlow Project
    </option>
  </select>

  {/* Assignee */}
  <select
    value={taskAssignee}
    onChange={(e) => setTaskAssignee(e.target.value)}
  >
    <option value="">Unassigned</option>

    <option value="6a8053c30a681292a88fcb2e">
      Rajan
    </option>
  </select>

  {/* Due Date */}
  <input
    type="date"
    value={taskDueDate}
    onChange={(e) => setTaskDueDate(e.target.value)}
  />

  {/* Priority */}
  <select
    value={taskPriority}
    onChange={(e) => setTaskPriority(e.target.value)}
  >
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
    <option value="urgent">Urgent</option>
  </select>

  {/* Status */}
  <select
    value={taskStatus}
    onChange={(e) => setTaskStatus(e.target.value)}
  >
    <option value="backlog">Backlog</option>
    <option value="todo">To Do</option>
    <option value="in-progress">In Progress</option>
    <option value="review">Review</option>
    <option value="done">Done</option>
  </select>
<textarea value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} placeholder="Task description" />
      <button type="button" className="primary-btn task-create-button" onClick={handleCreateTask}>Create task</button>
</div>
        
      </section>

    <main className="dashboard-content">
      <section className="panel board-panel">
          <div className="panel-header">
          <div>
            <p className="section-kicker">At a glance</p>
            <h2>Project board</h2>
          </div>
          <span className="panel-count">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
          </div>
          <KanbanBoard tasks={tasks} setSelectedTask={setSelectedTask} onRefresh={ensureTasksLoaded} />
        </section>

      <div className="lower-panels">
        <section className="panel backlog-panel">
          <div className="panel-header">
            <div>
              <p className="section-kicker">Task list</p>
              <h2>All tasks</h2>
            </div>
          </div>
          <BacklogTable tasks={tasks} setSelectedTask={setSelectedTask} />
        </section>

        <section className="panel task-details-panel">
          <div className="panel-header">
            <div>
              <p className="section-kicker">Keep things moving</p>
              <h2>Task details</h2>
            </div>
          </div>
          <TaskDetailsPanel task={selectedTask} onRefresh={ensureTasksLoaded} />
        </section>
      </div>
      </main>

      {loading && <div className="loading-indicator">Loading tasks...</div>}
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to={localStorage.getItem('taskflow_token') ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </Provider>
  );
}

export default App;

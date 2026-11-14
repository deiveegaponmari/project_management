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
        <div>
          <p className="eyebrow">Project Workspace</p>
          <h1>TaskFlow Manager</h1>
        </div>
        <div className="topbar-actions">
          <button className="secondary-btn" type="button" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <section className="summary-cards">
        <div className="card">
          <span>Total Tasks</span>
          <strong>{tasks.length}</strong>
        </div>
        <div className="card">
          <span>In Progress</span>
          <strong>{tasks.filter((task) => task.status === 'in-progress').length}</strong>
        </div>
        <div className="card">
          <span>Review</span>
          <strong>{tasks.filter((task) => task.status === 'review').length}</strong>
        </div>
        <div className="card">
          <span>Completed</span>
          <strong>{tasks.filter((task) => task.status === 'done').length}</strong>
        </div>
      </section>

      <section className="task-form panel">
        <h2>Create task</h2>
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
        <button type="button" className="primary-btn" onClick={handleCreateTask}>Create task</button>
</div>
        
      </section>

      <main className="content-grid">
        <section className="panel">
          <div className="panel-header">
            <h2>Kanban Board</h2>
          </div>
          <KanbanBoard tasks={tasks} setSelectedTask={setSelectedTask} onRefresh={ensureTasksLoaded} />
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Backlog</h2>
          </div>
          <BacklogTable tasks={tasks} setSelectedTask={setSelectedTask} />
        </section>
      </main>

      <section className="panel task-details-panel">
        <TaskDetailsPanel task={selectedTask} onRefresh={ensureTasksLoaded} />
      </section>

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

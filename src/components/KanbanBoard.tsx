import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskStatus } from '../store/tasksSlice';
import { updateTaskStatus } from '../services/taskApi';

const columns: TaskStatus[] = ['backlog', 'todo', 'in-progress', 'review', 'done'];

function TaskCard({ task, onClick }: { task: any; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="task-card" onClick={onClick}>
      <div className="task-card-header">
        <span className="task-id">{task.id}</span>
        <span className={`task-priority ${task.priority}`}>{task.priority}</span>
      </div>
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <div className="task-meta">
        <span>{task.assignee}</span>
        <span>{task.dueDate}</span>
      </div>
    </div>
  );
}

function Column({ status, tasks, onSelect }: { status: TaskStatus; tasks: any[]; onSelect: (task: any) => void }) {
  return (
    <div className="kanban-column">
      <h3>{status}</h3>
      <SortableContext items={tasks.map((task) => task.id)} strategy={rectSortingStrategy}>
        <div className="task-list">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onSelect(task)} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function KanbanBoard({ tasks, setSelectedTask, onRefresh }: { tasks: any[]; setSelectedTask: (task: any) => void; onRefresh: () => void }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const sourceTask = tasks.find((task) => task.id === active.id);
    const destinationColumn = columns.find((column) => column === String(over.id)) || sourceTask?.status;

    if (sourceTask && destinationColumn && sourceTask.status !== destinationColumn) {
      try {
        await updateTaskStatus(sourceTask.id, { status: destinationColumn });
        setSelectedTask({ ...sourceTask, status: destinationColumn });
        onRefresh();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {columns.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            onSelect={setSelectedTask}
          />
        ))}
      </div>
    </DndContext>
  );
}

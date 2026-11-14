import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Task ID', width: 110 },
  { field: 'title', headerName: 'Title', width: 220, flex: 1 },
  { field: 'status', headerName: 'Status', width: 140 },
  { field: 'assignee', headerName: 'Assignee', width: 130 },
  { field: 'dueDate', headerName: 'Due Date', width: 150 },
  { field: 'priority', headerName: 'Priority', width: 120 },
];

export default function BacklogTable({ tasks, setSelectedTask }: { tasks: any[]; setSelectedTask: (task: any) => void }) {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={tasks}
        columns={columns}
        pageSizeOptions={[5, 10]}
        onRowClick={(params) => setSelectedTask(params.row)}
      />
    </div>
  );
}

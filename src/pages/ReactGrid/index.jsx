import { useState } from 'react';
import { showAlert } from '../../common-components/Alert';
import { sanitizeHtml } from '../../libs/dompurify';
import DataGrid from './components/DataGrid';
import FormModal from './components/FormModal';
import './style.scss';
import { columns, sampleData } from './DummyData';
import SEOHelmet from '../../common/SEO/SEOHelmet';

const formatJoinDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const Tasks = () => {
  const [data, setData] = useState(sampleData);
  const [viewPopup, setViewPopup] = useState({ isOpen: false, data: null });
  const [editPopup, setEditPopup] = useState({ isOpen: false, data: null });
  const [addPopup, setAddPopup] = useState({ isOpen: false });

  const formFields = [
    {
      name: 'name',
      label: 'Employee Name',
      type: 'text',
      placeholder: 'Enter employee name',
      required: true,
    },
    {
      name: 'age',
      label: 'Age',
      type: 'number',
      placeholder: 'Enter age',
      required: true,
      min: 18,
      max: 100,
    },
    {
      name: 'department',
      label: 'Department',
      type: 'select',
      placeholder: 'Select Department',
      required: true,
      options: [
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'HR', label: 'HR' },
      ],
    },
    {
      name: 'salary',
      label: 'Salary',
      type: 'number',
      placeholder: 'Enter salary',
      required: true,
      min: 0,
      helpText: 'Enter annual salary in numbers',
    },
    {
      name: 'joinDate',
      label: 'Join Date',
      type: 'date',
      required: true,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
      ],
    },
  ];

  const handleDataChange = (newData) => {
    console.log('Data changed:', newData);
    setData(newData);
  };

  const handleView = (rowData) => {
    setViewPopup({ isOpen: true, data: rowData });
  };

  const handleEdit = (rowData) => {
    setEditPopup({ isOpen: true, data: { ...rowData } });
  };

  const handleToggleStatus = (rowData) => {
    const newStatus = rowData.status === 'Active' ? 'Inactive' : 'Active';
    const updatedData = data.map((row) =>
      row.id === rowData.id ? { ...row, status: newStatus } : row
    );
    setData(updatedData);
  };

  const handleEditSave = (updatedData) => {
    const safeData = Object.fromEntries(
      Object.entries(updatedData).map(([key, value]) => [
        key,
        typeof value === 'string' ? sanitizeHtml(value) : value,
      ])
    );

    const newData = data.map((row) =>
      row.id === safeData.id
        ? {
            ...safeData,
            age: Number(safeData.age),
            salary: Number(safeData.salary),
          }
        : row
    );
    setData(newData);
    setEditPopup({ isOpen: false, data: null });
    showAlert('success', 'Employee details updated successfully.');
  };

  const handleEditCancel = () => {
    setEditPopup({ isOpen: false, data: null });
  };

  const handleViewClose = () => {
    setViewPopup({ isOpen: false, data: null });
  };

  const handleAdd = () => {
    setAddPopup({ isOpen: true });
  };

  const handleAddSave = (newEmployee) => {
    const safeEmployee = Object.fromEntries(
      Object.entries(newEmployee).map(([key, value]) => [
        key,
        typeof value === 'string' ? sanitizeHtml(value) : value,
      ])
    );

    const maxId = Math.max(...data.map((item) => item.id), 0);
    const employeeWithId = {
      ...safeEmployee,
      id: maxId + 1,
      age: Number(safeEmployee.age),
      salary: Number(safeEmployee.salary),
    };
    console.log('Adding new employee:', employeeWithId);
    const newData = [employeeWithId, ...data];
    setData(newData);
    setAddPopup({ isOpen: false });
    showAlert('success', 'New employee added successfully.');
  };

  const handleAddCancel = () => {
    setAddPopup({ isOpen: false });
  };

  return (
    <div className="tasks">
      <SEOHelmet
        title="Grid"
        description="Manage your featured grid with our CRUD application"
        keywords="Grid, Table, crud"
      />
        <div className="Reactgrid__header">
          <div>React Data Grid Demo</div>
          <p>
            A feature-rich data grid component with sorting, filtering,
            grouping, and more!
          </p>
        </div>

      <div className="app__content">
        <DataGrid
          data={data}
          columns={columns}
          pageSize={10}
          allowGrouping={true}
          allowSorting={true}
          allowFiltering={true}
          allowPaging={true}
          allowSelection={true}
          allowExport={true}
          allowEditing={true}
          onDataChange={handleDataChange}
          onView={handleView}
          onEdit={handleEdit}
          onAdd={handleAdd}
          onToggleStatus={handleToggleStatus}
          className="demo-grid"
        />
      </div>

      {/* View Details Modal */}
      {viewPopup.isOpen && (
        <div className="popup-overlay" onClick={handleViewClose}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Employee Details</h3>
              <button className="popup-close" onClick={handleViewClose}>
                ×
              </button>
            </div>
            <div className="popup-body">
              <div className="detail-row">
                <label>Employee Name:</label>
                <span>{viewPopup.data?.name}</span>
              </div>
              <div className="detail-row">
                <label>Age:</label>
                <span>{viewPopup.data?.age}</span>
              </div>
              <div className="detail-row">
                <label>Department:</label>
                <span>{viewPopup.data?.department}</span>
              </div>
              <div className="detail-row">
                <label>Salary:</label>
                <span>₹{viewPopup.data?.salary?.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <label>Join Date:</label>
                <span>{formatJoinDate(viewPopup.data?.joinDate)}</span>
              </div>
              <div className="detail-row">
                <label>Status:</label>
                <span
                  className={`status-badge ${viewPopup.data?.status?.toLowerCase()}`}
                >
                  {viewPopup.data?.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      <FormModal
        isOpen={editPopup.isOpen}
        title="Edit Employee"
        data={editPopup.data}
        fields={formFields}
        onSave={handleEditSave}
        onCancel={handleEditCancel}
        submitButtonText="Update Employee"
      />

      {/* Add Employee Modal */}
      <FormModal
        isOpen={addPopup.isOpen}
        title="Add New Employee"
        data={{ status: 'Active' }}
        fields={formFields}
        onSave={handleAddSave}
        onCancel={handleAddCancel}
        submitButtonText="Add Employee"
      />
    </div>
  );
};

export default Tasks;

import React, { useState } from 'react';
import {
  useGetTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  usePatchTodoMutation,
} from '../../features/todo/todoApi';
import TodoItem from '../../features/todo/components/TodoItem';
import TodoForm from '../../features/todo/components/TodoForm';
import { Modal } from '../../common-components/Modal/Modal';
import { Button } from '../../common-components/Button/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import SEOHelmet from '../../common/SEO/SEOHelmet';
import styles from './TestMenuTodos.module.scss';

const TestMenuTodos = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [userId, setUserId] = useState(null);

  // RTK Query hooks - pass empty object to fetch all todos when no filter
  const { data: todos, isLoading, error } = useGetTodosQuery(
    userId ? { userId } : {}
  );
  const [createTodo, { isLoading: isCreating }] = useCreateTodoMutation();
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();
  const [patchTodo, { isLoading: isPatching }] = usePatchTodoMutation();
  const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation();

  const isLoadingAny = isCreating || isUpdating || isPatching || isDeleting;

  const handleCreate = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  const handleSubmit = async (todoData) => {
    try {
      if (editingTodo) {
        // Update existing todo
        await updateTodo(todoData).unwrap();
      } else {
        // Create new todo
        await createTodo(todoData).unwrap();
      }
      handleCloseModal();
      // RTK Query will automatically refetch due to invalidatesTags
    } catch (error) {
      console.error('Error saving todo:', error);
      alert(`Error saving todo: ${error?.data?.message || error?.data?.data?.message || error?.message || 'Unknown error occurred'}`);
    }
  };

  const handleToggle = async (id) => {
    try {
      const todo = todos?.find((t) => t.id === id);
      if (todo) {
        await patchTodo({
          id,
          completed: !todo.completed,
        }).unwrap();
        // RTK Query will automatically refetch due to invalidatesTags
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
      alert(`Error updating todo: ${error?.data?.message || error?.message || 'Unknown error occurred'}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodo(id).unwrap();
        // RTK Query will automatically refetch due to invalidatesTags
      } catch (error) {
        console.error('Error deleting todo:', error);
        alert(`Error deleting todo: ${error?.data?.message || error?.message || 'Unknown error occurred'}`);
      }
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setUserId(value === 'all' ? null : parseInt(value));
  };

  return (
    <>
      <SEOHelmet
        title="TestMenuTodos"
        description="Manage your todos with our CRUD application"
        keywords="todos, task management, crud"
      />
      <div className={styles.todosContainer}>
        <div className={styles.todosHeader}>
          <h1>Todo Management</h1>
          <div className={styles.headerActions}>
            <div className={styles.filterGroup}>
              <label htmlFor="userFilter">Filter by User ID:</label>
              <select
                id="userFilter"
                value={userId || 'all'}
                onChange={handleFilterChange}
                className={styles.filterSelect}
              >
                <option value="all">All Users</option>
                <option value="1">User 1</option>
                <option value="2">User 2</option>
                <option value="3">User 3</option>
                <option value="4">User 4</option>
                <option value="5">User 5</option>
              </select>
            </div>
            <Button variant="primary" onClick={handleCreate}>
              Create Todo
            </Button>
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <strong>Error loading todos:</strong>{' '}
            {error?.data?.message || 
             error?.data?.data?.message || 
             error?.error || 
             (error?.status === 'CONNECTION_ERROR' 
               ? 'Unable to connect to the server. Please make sure JSON Server is running on port 3001.'
               : 'Unknown error occurred')}
            <br />
            <small>
              {error?.status === 'CONNECTION_ERROR' && (
                <>Try running: <code>npm run json-server</code></>
              )}
            </small>
          </div>
        )}

        {isLoading ? (
          <LoadingSpinner fullScreen />
        ) : (
          <div className={styles.todosList}>
            {todos && todos.length > 0 ? (
              todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isLoading={isLoadingAny}
                />
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>No todos found. Create your first todo!</p>
              </div>
            )}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingTodo ? 'Edit Todo' : 'Create Todo'}
          size="medium"
        >
          <TodoForm
            todo={editingTodo}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            isLoading={isCreating || isUpdating}
          />
        </Modal>
      </div>
    </>
  );
};

export default TestMenuTodos;


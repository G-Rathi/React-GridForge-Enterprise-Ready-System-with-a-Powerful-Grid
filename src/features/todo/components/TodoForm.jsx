import React, { useState, useEffect } from 'react';
import { Input } from '../../../common-components/Input/Input';
import { Button } from '../../../common-components/Button/Button';
import styles from './TodoForm.module.scss';

export const TodoForm = ({ todo, onSubmit, onCancel, isLoading }) => {
  const [title, setTitle] = useState('');
  const [completed, setCompleted] = useState(false);
  const [userId, setUserId] = useState(1);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title || '');
      setCompleted(todo.completed || false);
      setUserId(todo.userId || 1);
    }
  }, [todo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }

    onSubmit({
      id: todo?.id,
      title: title.trim(),
      completed,
      userId,
    });

    if (!todo) {
      // Reset form only for new todos
      setTitle('');
      setCompleted(false);
      setUserId(1);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.todoForm}>
      <Input
        label="Todo Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter todo title"
        required
        disabled={isLoading}
      />
      <div className={styles.formGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            disabled={isLoading}
            className={styles.checkbox}
          />
          <span>Completed</span>
        </label>
      </div>
      <div className={styles.formGroup}>
        <Input
          label="User ID"
          type="number"
          value={userId}
          onChange={(e) => setUserId(parseInt(e.target.value) || 1)}
          disabled={isLoading}
          min="1"
        />
      </div>
      <div className={styles.formActions}>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || !title.trim()}
          loading={isLoading}
        >
          {todo ? 'Update Todo' : 'Create Todo'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;


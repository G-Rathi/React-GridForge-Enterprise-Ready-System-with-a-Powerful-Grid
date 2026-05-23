import React from 'react';
import { Button } from '../../../common-components/Button/Button';
import styles from './TodoItem.module.scss';

export const TodoItem = ({ todo, onToggle, onEdit, onDelete, isLoading }) => {
  return (
    <div className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}>
      <div className={styles.todoContent}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className={styles.checkbox}
          disabled={isLoading}
        />
        <div className={styles.todoText}>
          <h3 className={styles.title}>{todo.title}</h3>
          {todo.userId && (
            <span className={styles.userId}>User ID: {todo.userId}</span>
          )}
        </div>
      </div>
      <div className={styles.todoActions}>
        <Button
          variant="secondary"
          size="small"
          onClick={() => onEdit(todo)}
          disabled={isLoading}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="small"
          onClick={() => onDelete(todo.id)}
          disabled={isLoading}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default TodoItem;


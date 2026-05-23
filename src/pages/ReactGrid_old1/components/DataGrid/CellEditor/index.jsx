"use client"

import { useState, useEffect } from "react"
import "./style.scss"

const CellEditor = ({ value, column, onSave, onCancel }) => {
  const [editValue, setEditValue] = useState(value || "")

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSave(editValue)
    } else if (e.key === "Escape") {
      onCancel()
    }
  }

  const handleBlur = () => {
    onSave(editValue)
  }

  useEffect(() => {
    const input = document.querySelector(".cell-editor__input")
    if (input) {
      input.focus()
      // Only call select() for text/number/date inputs, not for select dropdowns
      if (typeof input.select === 'function') {
        input.select()
      }
    }
  }, [])

  switch (column.type) {
    case "number":
      return (
        <input
          type="number"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="cell-editor__input"
        />
      )
    case "date":
      return (
        <input
          type="date"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="cell-editor__input"
        />
      )
    case "select":
      return (
        <select
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="cell-editor__input"
        >
          {column.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    default:
      return (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="cell-editor__input"
        />
      )
  }
}

export default CellEditor

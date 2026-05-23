"use client"
import CellEditor from "../CellEditor"
import "./style.scss"

const DataRow = ({
  row,
  columns,
  columnOrder,
  isSelected = false,
  isAlternate = false,
  allowSelection = false,
  allowEditing = false,
  editingCell = null,
  onSelect,
  onEdit,
  onEditStart,
  onView,
  onEditRow,
  onToggleStatus,
}) => {
  const handleCellClick = (field) => {
    if (allowEditing && editingCell?.rowId !== row.id) {
      onEditStart({ rowId: row.id, field })
    }
  }

  const handleCellEdit = (field, value) => {
    onEdit(row.id, field, value)
  }

  const renderCell = (column) => {
    const value = row[column.field]
    const isEditing = editingCell?.rowId === row.id && editingCell?.field === column.field

    if (column.type === "actions") {
      return (
        <div className="data-row__actions">
          <button
            className="data-row__action-btn data-row__action-btn--view"
            onClick={(e) => {
              e.stopPropagation()
              onView?.(row)
            }}
            title="View Details"
          >
            👁️
          </button>
          <button
            className="data-row__action-btn data-row__action-btn--edit"
            onClick={(e) => {
              e.stopPropagation()
              onEditRow?.(row)
            }}
            title="Edit"
          >
            ✏️
          </button>
          <button
            className={`data-row__action-btn data-row__action-btn--toggle ${
              row.status === "Active" ? "data-row__action-btn--active" : "data-row__action-btn--inactive"
            }`}
            onClick={(e) => {
              e.stopPropagation()
              onToggleStatus?.(row)
            }}
            title={`Toggle Status (Currently ${row.status})`}
          >
            {row.status === "Active" ? "🟢" : "🔴"}
          </button>
        </div>
      )
    }

    if (isEditing) {
      return (
        <CellEditor
          value={value}
          column={column}
          onSave={(newValue) => handleCellEdit(column.field, newValue)}
          onCancel={() => onEditStart(null)}
        />
      )
    }

    // Custom render function
    if (column.render) {
      return column.render(value, row)
    }

    // Default rendering based on type
    switch (column.type) {
      case "number":
        return typeof value === "number" ? value.toLocaleString() : value
      case "date":
        return value ? new Date(value).toLocaleDateString() : ""
      case "boolean":
        return value ? "Yes" : "No"
      default:
        return value || ""
    }
  }

  return (
    <tr
      className={`
        data-row 
        ${isAlternate ? "data-row--alternate" : ""} 
        ${isSelected ? "data-row--selected" : ""}
      `}
    >
      {allowSelection && (
        <td className="data-row__cell data-row__cell--checkbox">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            className="data-row__checkbox"
          />
        </td>
      )}
      {columnOrder.map((field) => {
        const column = columns.find((col) => col.field === field)
        if (!column) return null

        return (
          <td
            key={field}
            data-label={column.title}
            className={`data-row__cell data-row__cell--${column.type || "text"}`}
            onClick={() => column.type !== "actions" && handleCellClick(field)}
            style={{
              width: column.width,
              cursor: allowEditing && column.type !== "actions" ? "pointer" : "default",
            }}
          >
            <div className="data-row__cell-content">{renderCell(column)}</div>
          </td>
        )
      })}
    </tr>
  )
}

export default DataRow

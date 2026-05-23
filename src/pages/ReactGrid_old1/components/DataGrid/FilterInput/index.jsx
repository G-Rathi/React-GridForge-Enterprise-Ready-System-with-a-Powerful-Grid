"use client"

import { useState, useEffect } from "react"
import "./style.scss"

const FilterInput = ({ column, value = {}, onChange }) => {
  const [operator, setOperator] = useState(value.operator || getDefaultOperator(column.type))
  const [filterValue, setFilterValue] = useState(value.value || "")
  const [showOperatorMenu, setShowOperatorMenu] = useState(false)

  useEffect(() => {
    setOperator(value.operator || getDefaultOperator(column.type))
    setFilterValue(value.value || "")
  }, [value, column.type])

  const handleOperatorChange = (newOperator) => {
    setOperator(newOperator)
    setShowOperatorMenu(false)
    onChange({ operator: newOperator, value: filterValue })
  }

  const handleValueChange = (newValue) => {
    setFilterValue(newValue)
    onChange({ operator, value: newValue })
  }

  const clearFilter = () => {
    setFilterValue("")
    onChange({ operator, value: "" })
  }

  const getOperatorIcon = (op) => {
    switch (op) {
      case "equals":
        return "="
      case "contains":
        return "⊃"
      case "startsWith":
        return "^"
      case "endsWith":
        return "$"
      case "greaterThan":
        return ">"
      case "lessThan":
        return "<"
      case "greaterThanOrEqual":
        return "≥"
      case "lessThanOrEqual":
        return "≤"
      default:
        return "⊃"
    }
  }

  const getOperatorOptions = (type) => {
    switch (type) {
      case "number":
        return [
          { value: "equals", label: "Equals" },
          { value: "greaterThan", label: "Greater Than" },
          { value: "lessThan", label: "Less Than" },
          { value: "greaterThanOrEqual", label: "Greater Than or Equal" },
          { value: "lessThanOrEqual", label: "Less Than or Equal" },
        ]
      case "date":
        return [
          { value: "equals", label: "Equals" },
          { value: "greaterThan", label: "After" },
          { value: "lessThan", label: "Before" },
        ]
      case "select":
        return [{ value: "equals", label: "Equals" }]
      default:
        return [
          { value: "contains", label: "Contains" },
          { value: "equals", label: "Equals" },
          { value: "startsWith", label: "Starts With" },
          { value: "endsWith", label: "Ends With" },
        ]
    }
  }

  const renderInput = () => {
    switch (column.type) {
      case "number":
        return (
          <input
            type="number"
            value={filterValue}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="Numeric"
            className="filter-input__field"
          />
        )
      case "date":
        return (
          <input
            type="date"
            value={filterValue}
            onChange={(e) => handleValueChange(e.target.value)}
            className="filter-input__field filter-input__field--date"
          />
        )
      case "select":
        return (
          <select
            value={filterValue}
            onChange={(e) => handleValueChange(e.target.value)}
            className="filter-input__field filter-input__field--select"
          >
            <option value="">All</option>
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
            value={filterValue}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="Input"
            className="filter-input__field"
          />
        )
    }
  }

  return (
    <div className="filter-input">
      {renderInput()}

      {column.type !== "select" && (
        <div className="filter-input__operators">
          <button
            className="filter-input__operator-btn"
            onClick={() => setShowOperatorMenu(!showOperatorMenu)}
            title={`Filter operator: ${operator}`}
          >
            {getOperatorIcon(operator)}
          </button>

          {showOperatorMenu && (
            <div className="filter-input__operator-menu">
              {getOperatorOptions(column.type).map((option) => (
                <button
                  key={option.value}
                  className={`filter-input__operator-option ${
                    operator === option.value ? "filter-input__operator-option--active" : ""
                  }`}
                  onClick={() => handleOperatorChange(option.value)}
                >
                  {getOperatorIcon(option.value)} {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {filterValue && (
        <button className="filter-input__clear" onClick={clearFilter} title="Clear filter">
          ×
        </button>
      )}
    </div>
  )
}

function getDefaultOperator(type) {
  switch (type) {
    case "number":
    case "date":
    case "select":
      return "equals"
    default:
      return "contains"
  }
}

export default FilterInput

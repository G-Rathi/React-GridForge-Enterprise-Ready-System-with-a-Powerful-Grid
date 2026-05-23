"use client"
import "./style.scss"

const GroupAggregates = ({ data, columns, aggregates }) => {
  const formatValue = (value, column) => {
    if (value === null || value === undefined) return "N/A"

    switch (column.type) {
      case "number":
        if (column.field === "salary") {
          return `$${value.toLocaleString()}`
        }
        return value.toLocaleString()
      case "date":
        return new Date(value).toLocaleDateString()
      default:
        return value.toString()
    }
  }

  const renderAggregateValue = (field, aggregateType, value) => {
    const column = columns.find((col) => col.field === field)
    if (!column) return null

    const formattedValue = formatValue(value, column)
    const label = getAggregateLabel(aggregateType)

    return (
      <span key={`${field}-${aggregateType}`} className="group-aggregates__item">
        {label}: {formattedValue}
      </span>
    )
  }

  const getAggregateLabel = (type) => {
    switch (type) {
      case "sum":
        return "Sum"
      case "avg":
        return "Average"
      case "min":
        return "Min"
      case "max":
        return "Max"
      case "count":
        return "Count"
      default:
        return type
    }
  }

  const getDisplayedAggregates = () => {
    const result = []

    Object.entries(aggregates).forEach(([field, fieldAggregates]) => {
      const column = columns.find((col) => col.field === field)
      if (!column || column.type !== "number") return

      // Show sum and average for most numeric fields
      if (fieldAggregates.sum !== undefined) {
        result.push(renderAggregateValue(field, "sum", fieldAggregates.sum))
      }
      if (fieldAggregates.avg !== undefined) {
        result.push(renderAggregateValue(field, "avg", Math.round(fieldAggregates.avg)))
      }
    })

    return result
  }

  const displayedAggregates = getDisplayedAggregates()

  if (displayedAggregates.length === 0) {
    return (
      <div className="group-aggregates">
        <span className="group-aggregates__item">Count: {data.length}</span>
      </div>
    )
  }

  return (
    <div className="group-aggregates">
      {displayedAggregates}
      <span className="group-aggregates__item">Count: {data.length}</span>
    </div>
  )
}

export default GroupAggregates

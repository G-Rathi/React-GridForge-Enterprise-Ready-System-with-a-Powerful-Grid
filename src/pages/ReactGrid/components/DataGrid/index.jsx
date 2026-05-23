'use client';

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import DataRow from './DataRow';
import GroupAggregates from './GroupAggregates';
import FilterInput from './FilterInput';
import './style.scss';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useDebounce } from '../../../../hooks/useDebounce';
import { stripTags } from '../../../../libs/dompurify';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const DataGrid = ({
  data = [],
  columns = [],
  pageSize = 10,
  allowGrouping = false,
  allowSorting = false,
  allowFiltering = false,
  allowPaging = false,
  allowSelection = false,
  allowExport = false,
  allowEditing = false,
  onDataChange,
  onView,
  onEdit,
  onAdd,
  onToggleStatus,
  className = '',
}) => {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [sortConfig, setSortConfig] = useState([]);
  const [filters, setFilters] = useState({});
  const [groupBy, setGroupBy] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [editingCell, setEditingCell] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [columnWidths, setColumnWidths] = useState({});
  const [columnOrder, setColumnOrder] = useState(() => {
    const baseColumns = columns.map((col) => col.field);
    const actionsIndex = baseColumns.indexOf('actions');
    if (actionsIndex > -1) {
      const reordered = [...baseColumns];
      reordered.splice(actionsIndex, 1);
      // reordered.splice(0, 0, 'actions');
      reordered.unshift('actions');
      return reordered;
    }
    return baseColumns;
  });
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [isDraggingToGroup, setIsDraggingToGroup] = useState(false);
  const [groupDropZoneActive, setGroupDropZoneActive] = useState(false);

  const [filterPopup, setFilterPopup] = useState({
    isOpen: false,
    field: null,
    rect: null,
  });
  const [openMenuField, setOpenMenuField] = useState(null);
  const headerRefs = useRef({});
  const popupRef = useRef(null);
  const abortSearchRef = useRef(null);

  const debouncedSearch = useDebounce((value) => {
    setSearchTerm(value);
  }, 400);
  //   const debouncedSearchFromAPI = useDebounce(async (value) => {
  //   try {
  //     if (abortSearchRef.current) {
  //       abortSearchRef.current.abort();
  //     }

  //     const controller = new AbortController();
  //     abortSearchRef.current = controller;

  //     const response = await fetch(`/api/employees?search=${value}`, {
  //       signal: controller.signal,
  //     });

  //     const result = await response.json();

  //     setData(result);
  //   } catch (err) {
  //     if (err.name === 'AbortError') {
  //       return;
  //     }
  //     console.error(err);
  //   }
  // }, 400);
  // useEffect(() => {
  //   return () => {
  //     if (abortSearchRef.current) {
  //       abortSearchRef.current.abort();
  //     }
  //   };
  // }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      setOpenMenuField(null);
      // Close filter popup if clicking outside of it
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setFilterPopup({ isOpen: false, field: null, rect: null, value: null });
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value); // instant UI update
    debouncedSearch(value); // delayed filtering
  };

  const MIN_COLUMN_WIDTH = 80;

  const resizeState = useRef({
    isResizing: false,
    resizeColumn: null,
    startX: 0,
    startWidth: 0,
  });

  // Filter data based on search term and filters
  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchTerm) {
      const searchWords = String(searchTerm.trim())
        .toLowerCase()
        .split(' ')
        .filter((word) => word.length > 0);

      result = result.filter((row) => {
        if (searchWords.length === 0) return true;

        // Check if ALL search words are found in the row (in any field)
        return searchWords.every((word) =>
          Object.values(row).some((value) =>
            String(value).toLowerCase().includes(word)
          )
        );
      });
    }

    Object.entries(filters).forEach(([field, filterValue]) => {
      if (filterValue && filterValue.value !== '') {
        const column = columns.find((col) => col.field === field);
        result = result.filter((row) => {
          const cellValue = row[field];
          const { operator = 'contains', value } = filterValue;

          switch (operator) {
            case 'equals':
              return String(cellValue) === String(value);
            case 'contains':
              return String(cellValue)
                .toLowerCase()
                .includes(String(value).toLowerCase());
            case 'startsWith':
              return String(cellValue)
                .toLowerCase()
                .startsWith(String(value).toLowerCase());
            case 'endsWith':
              return String(cellValue)
                .toLowerCase()
                .endsWith(String(value).toLowerCase());
            case 'greaterThan':
              return Number(cellValue) > Number(value);
            case 'lessThan':
              return Number(cellValue) < Number(value);
            case 'greaterThanOrEqual':
              return Number(cellValue) >= Number(value);
            case 'lessThanOrEqual':
              return Number(cellValue) <= Number(value);
            default:
              return true;
          }
        });
      }
    });

    return result;
  }, [data, searchTerm, filters, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (sortConfig.length === 0) return filteredData;

    return [...filteredData].sort((a, b) => {
      for (const { field, direction } of sortConfig) {
        const aValue = a[field];
        const bValue = b[field];

        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        if (aValue > bValue) comparison = 1;

        if (comparison !== 0) {
          return direction === 'asc' ? comparison : -comparison;
        }
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Group data
  const groupedData = useMemo(() => {
    if (!groupBy || groupBy.length === 0) return { ungrouped: sortedData };

    const groups = {};
    sortedData.forEach((row) => {
      // Create composite key from all groupBy fields
      const groupKey = groupBy
        .map((field) => `${field}: ${row[field] || 'Ungrouped'}`)
        .join(' | ');
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(row);
    });

    return groups;
  }, [sortedData, groupBy]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!allowPaging) return groupedData;

    const startIndex = (currentPage - 1) * currentPageSize;
    const endIndex = startIndex + currentPageSize;

    if (groupBy.length > 0) {
      const result = {};
      let currentIndex = 0;

      Object.entries(groupedData).forEach(([groupName, groupRows]) => {
        const groupStart = currentIndex;
        const groupEnd = currentIndex + groupRows.length;

        if (groupEnd > startIndex && groupStart < endIndex) {
          const sliceStart = Math.max(0, startIndex - groupStart);
          const sliceEnd = Math.min(groupRows.length, endIndex - groupStart);
          result[groupName] = groupRows.slice(sliceStart, sliceEnd);
        }

        currentIndex += groupRows.length;
      });

      return result;
    } else {
      return { ungrouped: groupedData.ungrouped.slice(startIndex, endIndex) };
    }
  }, [groupedData, currentPage, currentPageSize, allowPaging, groupBy]);

  // Calculate aggregates for groups
  const calculateAggregates = useCallback(
    (groupData) => {
      const aggregates = {};

      columns.forEach((column) => {
        if (column.type === 'number') {
          const values = groupData.map((row) => Number(row[column.field]) || 0);
          aggregates[column.field] = {
            sum: values.reduce((a, b) => a + b, 0),
            avg:
              values.length > 0
                ? values.reduce((a, b) => a + b, 0) / values.length
                : 0,
            min: Math.min(...values),
            max: Math.max(...values),
            count: values.length,
          };
        }
      });

      return aggregates;
    },
    [columns]
  );

  // Event handlers
  const handleSort = useCallback(
    (field) => {
      if (!allowSorting) return;

      setSortConfig((prev) => {
        const existingIndex = prev.findIndex(
          (config) => config.field === field
        );

        if (existingIndex >= 0) {
          const existing = prev[existingIndex];
          if (existing.direction === 'asc') {
            return [{ field, direction: 'desc' }];
          } else {
            return [];
          }
        } else {
          return [{ field, direction: 'asc' }];
        }
      });
    },
    [allowSorting]
  );

  const handleFilter = useCallback(
    (field, filterValue) => {
      if (!allowFiltering) return;

      setFilters((prev) => ({
        ...prev,
        [field]: filterValue,
      }));
      setCurrentPage(1);
    },
    [allowFiltering]
  );

  const handleGroupBy = useCallback(
    (field) => {
      if (!allowGrouping) return;

      setGroupBy((prev) => {
        if (prev.includes(field)) {
          // Remove field from groupBy array
          return prev.filter((f) => f !== field);
        } else {
          // Add field to groupBy array
          return [...prev, field];
        }
      });
      setCurrentPage(1);
      setExpandedGroups(new Set());
    },
    [allowGrouping]
  );

  const handleRowSelect = useCallback(
    (rowId, isSelected) => {
      if (!allowSelection) return;

      setSelectedRows((prev) => {
        const newSet = new Set(prev);
        if (isSelected) {
          newSet.add(rowId);
        } else {
          newSet.delete(rowId);
        }
        return newSet;
      });
    },
    [allowSelection]
  );

  const handleSelectAll = useCallback(
    (isSelected) => {
      if (!allowSelection) return;

      if (isSelected) {
        const allIds = new Set();
        Object.values(paginatedData)
          .flat()
          .forEach((row) => allIds.add(row.id));
        setSelectedRows(allIds);
      } else {
        setSelectedRows(new Set());
      }
    },
    [allowSelection, paginatedData]
  );

  const sanitizeValue = useCallback((value) => {
    if (typeof value === 'string') {
      return stripTags(value);
    }
    return value;
  }, []);

  const handleCellEdit = useCallback(
    (rowId, field, value) => {
      if (!allowEditing) return;

      const newData = data.map((row) =>
        row.id === rowId ? { ...row, [field]: sanitizeValue(value) } : row
      );

      onDataChange?.(newData);
      setEditingCell(null);
    },
    [allowEditing, data, onDataChange, sanitizeValue]
  );

  const handleBulkStatusUpdate = useCallback(
    (status) => {
      if (!allowSelection || selectedRows.size === 0) return;

      const newData = data.map((row) => {
        if (selectedRows.has(row.id)) {
          return { ...row, status: status };
        }
        return row;
      });

      onDataChange?.(newData);
      setSelectedRows(new Set()); // Clear selection after update
    },
    [allowSelection, selectedRows, data, onDataChange]
  );

  const handleExport = useCallback(
    (format) => {
      if (!allowExport) return;

      const exportData =
        selectedRows.size > 0
          ? filteredData.filter((row) => selectedRows.has(row.id))
          : filteredData;

      const exportColumns = columnOrder
        .map((field) => columns.find((col) => col.field === field))
        .filter(Boolean)
        .filter((col) => col.field !== 'actions');

      if (format === 'csv') {
        const BOM = '\uFEFF'; // important for Excel + encoding

        const csvContent = [
          exportColumns.map((col) => `"${stripTags(col.title)}"`).join(','),
          ...exportData.map((row) =>
            exportColumns
              .map((col) => {
                const value = stripTags(row[col.field]?.toString?.() || '');
                return `"${value.replace(/"/g, '""')}"`; // escape quotes
              })
              .join(',')
          ),
        ].join('\n');

        const blob = new Blob([BOM + csvContent], {
          type: 'text/csv;charset=utf-8;',
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data-export.csv';
        a.click();
        URL.revokeObjectURL(url);
      }
      // else if (format === 'excel') {
      //   const excelContent = `
      //     <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      //     <head>
      //       <meta charset="utf-8">
      //       <meta name="ProgId" content="Excel.Sheet">
      //       <meta name="Generator" content="Microsoft Excel 15">
      //       <style>
      //         table { border-collapse: collapse; width: 100%; }
      //         th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      //         th { background-color: #f2f2f2; font-weight: bold; }
      //       </style>
      //     </head>
      //     <body>
      //       <table>
      //         <thead>
      //           <tr>
      //             ${exportColumns.map((col) => `<th>${col.title}</th>`).join('')}
      //           </tr>
      //         </thead>
      //         <tbody>
      //           ${exportData
      //             .map(
      //               (row) =>
      //                 `<tr>${exportColumns.map((col) => `<td>${row[col.field] || ''}</td>`).join('')}</tr>`
      //             )
      //             .join('')}
      //         </tbody>
      //       </table>
      //     </body>
      //     </html>
      //   `;

      //   const blob = new Blob([excelContent], {
      //     type: 'application/vnd.ms-excel',
      //   });
      //   const url = URL.createObjectURL(blob);
      //   const a = document.createElement('a');
      //   a.href = url;
      //   a.download = 'data-export.xls';
      //   a.click();
      //   URL.revokeObjectURL(url);
      // }
      // else if (format === 'excel') {
      //   const data = exportData.map((row) => {
      //     const obj = {};
      //     exportColumns.forEach((col) => {
      //       obj[col.title] = stripTags(row[col.field]?.toString?.() || '');
      //     });
      //     return obj;
      //   });

      //   const worksheet = XLSX.utils.json_to_sheet(data);
      //   const workbook = XLSX.utils.book_new();
      //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

      //   XLSX.writeFile(workbook, 'data-export.xlsx');
      // }

      //  else if (format === 'excel') {
      //   const workbook = new ExcelJS.Workbook();
      //   const worksheet = workbook.addWorksheet('Data');

      //   // Headers
      //   const headers = exportColumns.map((col) => stripTags(col.title));
      //   const headerRow = worksheet.addRow(headers);

      //   // ✅ Make each header cell bold (IMPORTANT FIX)
      //   headerRow.eachCell((cell) => {
      //     cell.font = { bold: true };
      //   });

      //   // Data
      //   exportData.forEach((row) => {
      //     const rowData = exportColumns.map((col) =>
      //       stripTags(row[col.field]?.toString?.() || '')
      //     );
      //     worksheet.addRow(rowData);
      //   });

      //   // Auto width (better version)
      //   worksheet.columns = headers.map((header) => ({
      //     header,
      //     key: header,
      //     width: 20,
      //   }));

      //   // Download
      //   workbook.xlsx.writeBuffer().then((buffer) => {
      //     saveAs(new Blob([buffer]), 'data-export.xlsx');
      //   });
      // }
      else if (format === 'excel') {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data');

        // Headers
        const headers = exportColumns.map((col) => stripTags(col.title));
        const headerRow = worksheet.addRow(headers);

        // Bold header
        headerRow.eachCell((cell) => {
          cell.font = { bold: true };
        });

        // Data
        exportData.forEach((row) => {
          const rowData = exportColumns.map((col) =>
            stripTags(row[col.field]?.toString?.() || '')
          );
          worksheet.addRow(rowData);
        });

        // Enable filter on header
        worksheet.autoFilter = {
          from: {
            row: 1,
            column: 1,
          },
          to: {
            row: 1,
            column: headers.length,
          },
        };

        // Column width
        worksheet.columns.forEach((column) => {
          column.width = 20;
        });
        worksheet.views = [{ state: 'frozen', ySplit: 1 }];

        // Download
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer]), 'data-export.xlsx');
        });
      } else if (format === 'pdf1') {
        const printWindow = window.open('', '_blank');
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Data Export</title>
            <style>
              @page {
                size: A4 landscape;
                margin: 0.5in;
              }

              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                font-size: 10px;
                line-height: 1.2;
              }

              .header {
                text-align: center;
                margin-bottom: 20px;
                border-bottom: 2px solid #333;
                padding-bottom: 10px;
              }

              .header h1 {
                margin: 0;
                font-size: 18px;
                color: #333;
              }

              .preview-only {
                display: inline;
              }

              @media print {
                body { margin: 0; }
                .no-print { display: none !important; }
                .preview-actions { display: none !important; }
                .preview-only { display: none !important; }
                table { font-size: 8px; }
                th, td { padding: 4px 2px; }
              }

              .preview-actions {
                margin-bottom: 16px;
                text-align: center;
              }

              .download-pdf {
                display: inline-block;
                padding: 10px 18px;
                font-size: 12px;
                color: #fff;
                background-color: #007bff;
                border: none;
                border-radius: 4px;
                cursor: pointer;
              }

              .download-pdf:hover {
                background-color: #0069d9;
              }

              table {
                border-collapse: collapse;
                width: 100%;
                margin-top: 10px;
                page-break-inside: auto;
              }

              thead {
                display: table-header-group;
              }

              tbody {
                display: table-row-group;
              }

              tr {
                page-break-inside: avoid;
                page-break-after: auto;
              }

              th, td {
                border: 1px solid #ddd;
                padding: 6px 4px;
                text-align: left;
                font-size: 9px;
                word-wrap: break-word;
                max-width: 120px;
              }

              th {
                background-color: #f2f2f2;
                font-weight: bold;
                font-size: 10px;
              }

              tr:nth-child(even) {
                background-color: #f9f9f9;
              }

              @media print {
                body { margin: 0; }
                .no-print { display: none !important; }
                .preview-actions { display: none !important; }
                table { font-size: 8px; }
                th, td { padding: 4px 2px; }
              }
            </style>
            <script>
              function handleDownloadClick() {
                window.print();
              }
            </script>
          </head>
          <body>
            <div class="header">
              <h1>Data Export<span class="preview-only"> Preview</span></h1>
              <div class="export-info">
                <p>Export Date: ${new Date().toLocaleDateString()} | Total Records: ${exportData.length}${selectedRows.size > 0 ? ' (Selected Records)' : ''}</p>
              </div>
            </div>
            <div class="preview-actions no-print">
              <button class="download-pdf" onclick="handleDownloadClick()">Print / Download PDF</button>
            </div>
            <table>
              <thead>
                <tr>
                  ${exportColumns.map((col) => `<th>${col.title}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${exportData
                  .map(
                    (row) =>
                      `<tr>${exportColumns.map((col) => `<td>${row[col.field] || ''}</td>`).join('')}</tr>`
                  )
                  .join('')}
              </tbody>
            </table>
          </body>
          </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
      } else if (format === 'pdf2') {
        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'pt',
          format: 'a4',
        });

        // Header
        doc.setFontSize(16);
        doc.text('Data Export', 40, 30);

        doc.setFontSize(10);
        doc.text(
          `Export Date: ${new Date().toLocaleDateString()} | Total Records: ${exportData.length}${
            selectedRows.size > 0 ? ' (Selected Records)' : ''
          }`,
          40,
          50
        );

        // Table
        autoTable(doc, {
          startY: 70,
          head: [exportColumns.map((col) => stripTags(col.title))],
          body: exportData.map((row) =>
            exportColumns.map((col) =>
              stripTags(row[col.field]?.toString?.() || '')
            )
          ),
          styles: {
            fontSize: 8,
          },
          headStyles: {
            fillColor: [240, 240, 240],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
          },
          theme: 'grid',
        });

        // Download
        doc.save('Data_Export.pdf');
      }
    },
    [allowExport, filteredData, selectedRows, columns, columnOrder]
  );

  const toggleGroupExpansion = useCallback((groupName) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  }, []);

  const handleResizeMove = useCallback((e) => {
    const { isResizing, resizeColumn, startX, startWidth } =
      resizeState.current;
    if (!isResizing || !resizeColumn) return;

    const deltaX = e.clientX - startX;
    const newWidth = Math.max(MIN_COLUMN_WIDTH, startWidth + deltaX);

    setColumnWidths((prev) => ({
      ...prev,
      [resizeColumn]: `${newWidth}px`,
    }));
  }, []);

  const handleResizeEnd = useCallback(() => {
    resizeState.current = {
      isResizing: false,
      resizeColumn: null,
      startX: 0,
      startWidth: 0,
    };

    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  }, [handleResizeMove]);

  const handleResizeStart = useCallback(
    (e, field) => {
      e.preventDefault();
      e.stopPropagation();

      const column = columns.find((col) => col.field === field);
      const currentWidth = columnWidths[field] || column?.width || 150;

      resizeState.current = {
        isResizing: true,
        resizeColumn: field,
        startX: e.clientX,
        startWidth:
          typeof currentWidth === 'string'
            ? Number.parseInt(currentWidth)
            : currentWidth,
      };

      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
    },
    [columnWidths, columns, handleResizeMove, handleResizeEnd]
  );

  const handleColumnDragStart = useCallback(
    (e, field) => {
      const column = columns.find((col) => col.field === field);
      const isGroupable = column?.groupable !== false;

      setDraggedColumn(field);
      setIsDraggingToGroup(false);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', e.target.outerHTML);
      e.dataTransfer.setData('columnField', field);
      e.dataTransfer.setData('columnGroupable', isGroupable.toString());

      const dragImage = e.target.cloneNode(true);
      dragImage.style.opacity = '0.8';
      dragImage.style.transform = 'rotate(5deg)';
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, e.offsetX, e.offsetY);

      setTimeout(() => document.body.removeChild(dragImage), 0);
    },
    [columns]
  );

  const handleColumnDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleColumnDragEnter = useCallback(
    (e, field) => {
      e.preventDefault();
      if (draggedColumn && draggedColumn !== field) {
        setDragOverColumn(field);
      }
    },
    [draggedColumn]
  );

  const handleColumnDragLeave = useCallback((e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverColumn(null);
    }
  }, []);

  const handleColumnDrop = useCallback(
    (e, targetField) => {
      e.preventDefault();

      if (!draggedColumn || draggedColumn === targetField) {
        setDraggedColumn(null);
        setDragOverColumn(null);
        return;
      }

      setColumnOrder((prev) => {
        const newOrder = [...prev];
        const draggedIndex = newOrder.indexOf(draggedColumn);
        const targetIndex = newOrder.indexOf(targetField);

        newOrder.splice(draggedIndex, 1);
        newOrder.splice(targetIndex, 0, draggedColumn);

        return newOrder;
      });

      setDraggedColumn(null);
      setDragOverColumn(null);
    },
    [draggedColumn]
  );

  const handleColumnDragEnd = useCallback(() => {
    setDraggedColumn(null);
    setDragOverColumn(null);
    setIsDraggingToGroup(false);
    setGroupDropZoneActive(false);
  }, []);

  const handleGroupZoneDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setGroupDropZoneActive(true);
  }, []);

  const handleGroupZoneDragEnter = useCallback((e) => {
    e.preventDefault();
    setGroupDropZoneActive(true);
  }, []);

  const handleGroupZoneDragLeave = useCallback((e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setGroupDropZoneActive(false);
    }
  }, []);

  const handleGroupZoneDrop = useCallback(
    (e) => {
      e.preventDefault();
      setGroupDropZoneActive(false);
      const field = e.dataTransfer.getData('columnField') || draggedColumn;
      const isGroupable = e.dataTransfer.getData('columnGroupable') === 'true';

      // Check if column allows grouping
      const column = columns.find((col) => col.field === field);
      const canGroup = column?.groupable !== false;

      if (field && !groupBy.includes(field) && canGroup && isGroupable) {
        setGroupBy((prev) => [...prev, field]);
        setCurrentPage(1);
        setExpandedGroups(new Set());
      }

      setDraggedColumn(null);
      setDragOverColumn(null);
    },
    [draggedColumn, groupBy, columns]
  );

  const handleGroupTagDragStart = useCallback((e, field) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('groupField', field);
  }, []);

  const handleGroupTagDrop = useCallback((e, targetField) => {
    e.preventDefault();
    const draggedField = e.dataTransfer.getData('groupField');

    if (draggedField && draggedField !== targetField) {
      setGroupBy((prev) => {
        const newGroupBy = [...prev];
        const draggedIndex = newGroupBy.indexOf(draggedField);
        const targetIndex = newGroupBy.indexOf(targetField);

        if (draggedIndex !== -1 && targetIndex !== -1) {
          newGroupBy.splice(draggedIndex, 1);
          newGroupBy.splice(targetIndex, 0, draggedField);
        }

        return newGroupBy;
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [handleResizeMove, handleResizeEnd]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / currentPageSize);
  const startItem = (currentPage - 1) * currentPageSize + 1;
  const endItem = Math.min(currentPage * currentPageSize, totalItems);

  const renderFilterPopup = () => {
    if (!filterPopup?.isOpen) return null;
    const popupColumn = columns.find((c) => c.field === filterPopup.field);
    if (!popupColumn) return null;

    // Calculate position with overflow protection
    const rect = filterPopup.rect;
    const popupWidth = 240; // min-width from CSS
    const popupHeight = 150; // approximate height
    const padding = 10;

    // Position just below the header cell
    let top = rect ? rect.bottom : 0;
    let left = rect ? rect.left : 0;

    // Check right overflow
    if (rect && left + popupWidth > window.innerWidth) {
      left = window.innerWidth - popupWidth - padding;
    }

    // Check left overflow
    if (left < padding) {
      left = padding;
    }

    // Check bottom overflow
    if (rect && top + popupHeight > window.innerHeight) {
      top = rect.top - popupHeight - 5;
    }

    const closePopup = () =>
      setFilterPopup({ isOpen: false, field: null, rect: null, value: null });

    return (
      <div
        ref={popupRef}
        className="data-grid__filter-popup"
        style={{
          position: 'fixed',
          top: `${top}px`,
          left: `${left}px`,
          zIndex: 9999,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="data-grid__filter-popup-body">
          <FilterInput
            column={popupColumn}
            value={filterPopup.value}
            onChange={(val) =>
              setFilterPopup((prev) => ({ ...prev, value: val }))
            }
          />
        </div>
        <div className="data-grid__filter-popup-actions">
          <button
            className="data-grid__btn data-grid__btn--primary"
            onClick={() => {
              handleFilter(filterPopup.field, filterPopup.value);
              closePopup();
            }}
          >
            Apply
          </button>
          <button
            className="data-grid__btn"
            onClick={() => {
              handleFilter(filterPopup.field, null);
              closePopup();
            }}
          >
            Clear
          </button>
          <button className="data-grid__btn" onClick={closePopup}>
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`data-grid ${className}`}>
      <div className="data-grid__toolbar">
        <div className="data-grid__toolbar-left">
          <button
            className="data-grid__btn data-grid__btn--primary"
            onClick={onAdd}
          >
            <span className="data-grid__btn-icon">+</span>
            Add New
          </button>

          {allowSelection && selectedRows.size > 0 && (
            <div className="data-grid__status-group">
              <button
                className="data-grid__btn data-grid__btn--success"
                onClick={() => handleBulkStatusUpdate('Active')}
                title={`Mark ${selectedRows.size} selected rows as Active`}
              >
                <span className="data-grid__btn-icon">✓</span>
                Active ({selectedRows.size})
              </button>
              <button
                className="data-grid__btn data-grid__btn--warning"
                onClick={() => handleBulkStatusUpdate('Inactive')}
                title={`Mark ${selectedRows.size} selected rows as Inactive`}
              >
                <span className="data-grid__btn-icon">⏸</span>
                Inactive ({selectedRows.size})
              </button>
            </div>
          )}

          <div className="data-grid__export-group">
            <button
              className="data-grid__btn data-grid__btn--secondary"
              onClick={() => handleExport('csv')}
            >
              <span className="data-grid__btn-icon">📄</span>
              Export CSV
              {selectedRows.size > 0 ? ` (${selectedRows.size})` : ''}
            </button>
            <button
              className="data-grid__btn data-grid__btn--secondary"
              onClick={() => handleExport('excel')}
            >
              <span className="data-grid__btn-icon">📊</span>
              Export Excel
              {selectedRows.size > 0 ? ` (${selectedRows.size})` : ''}
            </button>
            <button
              className="data-grid__btn data-grid__btn--secondary"
              onClick={() => handleExport('pdf1')}
            >
              <span className="data-grid__btn-icon">📋</span>
              Preview and Export PDF
              {selectedRows.size > 0 ? ` (${selectedRows.size})` : ''}
            </button>
            <button
              className="data-grid__btn data-grid__btn--secondary"
              onClick={() => handleExport('pdf2')}
            >
              <span className="data-grid__btn-icon">📋</span>
              Export PDF
              {selectedRows.size > 0 ? ` (${selectedRows.size})` : ''}
            </button>
          </div>
        </div>
        <div className="data-grid__toolbar-right">
          <div className="data-grid__search">
            <input
              type="text"
              placeholder="Search..."
              // value={searchTerm}
              value={searchInput}
              onChange={handleSearchChange}
              // onChange={(e) => setSearchTerm(e.target.value)}
              className="data-grid__search-input"
            />
            {/* {searchTerm && (
              <span
                className="data-grid__search-clear"
                onClick={() => setSearchTerm('')}
                title="Clear"
              >
                ✖
              </span>
            )} */}
            {searchInput && (
              <span
                className="data-grid__search-clear"
                onClick={() => {
                  setSearchInput('');
                  setSearchTerm('');
                }}
              >
                ✖
              </span>
            )}

            <span className="data-grid__search-icon">🔍</span>
          </div>
        </div>
      </div>
      {allowGrouping && (
        <div
          className={`data-grid__group-drop-zone ${
            groupDropZoneActive ? 'data-grid__group-drop-zone--active' : ''
          } ${groupBy.length > 0 ? 'data-grid__group-drop-zone--has-items' : ''}`}
          onDragOver={handleGroupZoneDragOver}
          onDragEnter={handleGroupZoneDragEnter}
          onDragLeave={handleGroupZoneDragLeave}
          onDrop={handleGroupZoneDrop}
        >
          {groupBy.length === 0 ? (
            <div className="data-grid__group-drop-zone-placeholder">
              <span className="data-grid__group-drop-zone-icon">⇊</span>
              Drag column headers here to group by them
            </div>
          ) : (
            <div className="data-grid__group-drop-zone-content">
              <span className="data-grid__group-drop-zone-label">
                <span className="data-grid__group-icon">📁</span>
                Grouped by:
              </span>
              <div className="data-grid__group-tags-container">
                {groupBy.map((field) => (
                  <div
                    key={field}
                    className="data-grid__group-tag data-grid__group-tag--draggable"
                    draggable="true"
                    onDragStart={(e) => handleGroupTagDragStart(e, field)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleGroupTagDrop(e, field)}
                  >
                    {columns.find((col) => col.field === field)?.title}
                    <button
                      className="data-grid__group-tag-clear"
                      onClick={() => handleGroupBy(field)}
                      title="Remove grouping"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="data-grid__group-clear"
                onClick={() => setGroupBy([])}
                title="Clear all grouping"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
      <div className="data-grid__container">
        <table className="data-grid__table">
          <thead className="data-grid__header">
            <tr>
              {allowSelection && (
                <th
                  className="data-grid__header-cell data-grid__header-cell--checkbox"
                  draggable="false"
                >
                  <input
                    type="checkbox"
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={
                      selectedRows.size > 0 &&
                      selectedRows.size ===
                        Object.values(paginatedData).flat().length
                    }
                  />
                </th>
              )}
              {columnOrder.map((field) => {
                const column = columns.find((col) => col.field === field);
                if (!column) return null;

                const sortInfo = sortConfig.find(
                  (config) => config.field === field
                );
                const isGrouped = groupBy.includes(field);
                const isDragging = draggedColumn === field;
                const isDragOver = dragOverColumn === field;
                const isActionsColumn = column.type === 'actions';

                return (
                  <th
                    key={field}
                    ref={(el) => (headerRefs.current[field] = el)}
                    className={`data-grid__header-cell ${isGrouped ? 'data-grid__header-cell--grouped' : ''} ${
                      isDragging ? 'data-grid__header-cell--dragging' : ''
                    } ${isDragOver ? 'data-grid__header-cell--drag-over' : ''} ${
                      column.groupable === false
                        ? 'data-grid__header-cell--not-groupable'
                        : ''
                    }`}
                    style={{ width: columnWidths[field] || column.width }}
                    draggable="true"
                    onDragStart={(e) => handleColumnDragStart(e, field)}
                    onDragOver={handleColumnDragOver}
                    onDragEnter={(e) => handleColumnDragEnter(e, field)}
                    onDragLeave={handleColumnDragLeave}
                    onDrop={(e) => handleColumnDrop(e, field)}
                    onDragEnd={handleColumnDragEnd}
                  >
                    <div className="data-grid__header-content">
                      <span
                        className="data-grid__header-title"
                        onClick={
                          !isActionsColumn ? () => handleSort(field) : undefined
                        }
                        style={{
                          cursor: isActionsColumn ? 'default' : 'pointer',
                        }}
                      >
                        {column.title}
                        {sortInfo && (
                          <span className="data-grid__sort-indicator">
                            {sortInfo.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </span>
                      {!isActionsColumn && (
                        <div
                          className={`data-grid__header-menu ${openMenuField === field ? 'is-open' : ''}`}
                        >
                          <button
                            className={`data-grid__filter-icon ${filters[field]?.value ? 'is-active' : ''}`}
                            title={`Filter ${column.title}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuField(null);
                              const el = headerRefs.current[field];
                              const rect = el
                                ? el.getBoundingClientRect()
                                : null;
                              setFilterPopup({
                                isOpen: true,
                                field,
                                rect,
                                value: filters[field] || {
                                  operator: 'contains',
                                  value: '',
                                },
                              });
                            }}
                          >
                            ⌕
                          </button>
                          <button
                            className="data-grid__menu-trigger"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFilterPopup({
                                isOpen: false,
                                field: null,
                                rect: null,
                                value: null,
                              });
                              setOpenMenuField((prev) =>
                                prev === field ? null : field
                              );
                            }}
                          >
                            ⋮
                          </button>
                          <div
                            className="data-grid__menu-dropdown"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => {
                                handleSort(field);
                                setOpenMenuField(null);
                              }}
                            >
                              Sort Ascending
                            </button>
                            <button
                              onClick={() => {
                                handleSort(field);
                                setOpenMenuField(null);
                              }}
                            >
                              Sort Descending
                            </button>
                            {column.groupable !== false && (
                              <button
                                onClick={() => {
                                  handleGroupBy(field);
                                  setOpenMenuField(null);
                                }}
                              >
                                Group by this column
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                      <div
                        className="data-grid__resize-handle"
                        onMouseDown={(e) => handleResizeStart(e, field)}
                        style={{ cursor: 'col-resize' }}
                      />
                    </div>
                  </th>
                );
              })}
            </tr>

            {/* {allowFiltering && (
              <tr className="data-grid__filter-row">
                {allowSelection && <th className="data-grid__filter-cell"></th>}
                {columnOrder.map((field) => {
                  const column = columns.find((col) => col.field === field);
                  if (!column) return null;

                  return (
                    <th key={field} className="data-grid__filter-cell">
                      {column.type !== 'actions' && (
                        <div className="data-grid__filter-empty" />
                      )}
                    </th>
                  );
                })}
              </tr>
            )} */}
          </thead>

          <tbody className="data-grid__body">
            {Object.entries(paginatedData).map(([groupName, groupRows]) => (
              <React.Fragment key={groupName}>
                {groupBy.length > 0 && groupName !== 'ungrouped' && (
                  <>
                    <tr className="data-grid__group-header">
                      <td
                        colSpan={columns.length + (allowSelection ? 1 : 0)}
                        className="data-grid__group-header-cell"
                      >
                        <button
                          className="data-grid__group-toggle"
                          onClick={() => toggleGroupExpansion(groupName)}
                        >
                          <span className="data-grid__group-icon">
                            {expandedGroups.has(groupName) ? '▼' : '▶'}
                          </span>
                          <span className="data-grid__group-title">
                            {groupName} ({groupRows.length} items)
                          </span>
                        </button>
                      </td>
                    </tr>
                    {expandedGroups.has(groupName) &&
                      groupRows.map((row, index) => (
                        <DataRow
                          key={row.id}
                          row={row}
                          columns={columns}
                          columnOrder={columnOrder}
                          isSelected={selectedRows.has(row.id)}
                          isAlternate={index % 2 === 1}
                          allowSelection={allowSelection}
                          allowEditing={allowEditing}
                          editingCell={editingCell}
                          onSelect={(isSelected) =>
                            handleRowSelect(row.id, isSelected)
                          }
                          onEdit={handleCellEdit}
                          onEditStart={setEditingCell}
                          onView={onView}
                          onEditRow={onEdit}
                          onToggleStatus={onToggleStatus}
                        />
                      ))}
                    {expandedGroups.has(groupName) && (
                      <tr className="data-grid__group-footer">
                        <td
                          colSpan={columns.length + (allowSelection ? 1 : 0)}
                          className="data-grid__group-footer-cell"
                        >
                          <GroupAggregates
                            data={groupRows}
                            columns={columns}
                            aggregates={calculateAggregates(groupRows)}
                          />
                        </td>
                      </tr>
                    )}
                  </>
                )}
                {groupBy.length === 0 &&
                  groupRows.map((row, index) => (
                    <DataRow
                      key={row.id}
                      row={row}
                      columns={columns}
                      columnOrder={columnOrder}
                      isSelected={selectedRows.has(row.id)}
                      isAlternate={index % 2 === 1}
                      allowSelection={allowSelection}
                      allowEditing={allowEditing}
                      editingCell={editingCell}
                      onSelect={(isSelected) =>
                        handleRowSelect(row.id, isSelected)
                      }
                      onEdit={handleCellEdit}
                      onEditStart={setEditingCell}
                      onView={onView}
                      onEditRow={onEdit}
                      onToggleStatus={onToggleStatus}
                    />
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="data-grid__status-bar">
        <div className="data-grid__status-left">
          <span>
            Sum:{' '}
            {filteredData
              .reduce((sum, row) => sum + (Number(row.salary) || 0), 0)
              .toLocaleString()}
          </span>
          <span>
            Average:{' '}
            {Math.round(
              filteredData.reduce(
                (sum, row) => sum + (Number(row.salary) || 0),
                0
              ) / filteredData.length
            ).toLocaleString()}
          </span>
          <span>
            Min:{' '}
            {Math.min(
              ...filteredData.map((row) => Number(row.salary) || 0)
            ).toLocaleString()}
          </span>
          <span>Count: {filteredData.length}</span>
        </div>
        <div className="data-grid__status-right">
          <span>
            {startItem} - {endItem} of {totalItems} items
          </span>
        </div>
      </div>

      {allowPaging && (
        <div className="data-grid__pager">
          <div className="data-grid__pager-left">
            <button
              className="data-grid__pager-btn"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              ⏮
            </button>
            <button
              className="data-grid__pager-btn"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              ◀
            </button>

            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (currentPage <= 4) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = currentPage - 3 + i;
              }

              return (
                <button
                  key={pageNum}
                  className={`data-grid__pager-btn ${currentPage === pageNum ? 'data-grid__pager-btn--active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              className="data-grid__pager-btn"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              ▶
            </button>
            <button
              className="data-grid__pager-btn"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              ⏭
            </button>
          </div>

          <div className="data-grid__pager-right">
            <select
              value={currentPageSize}
              onChange={(e) => {
                setCurrentPageSize(Number.parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="data-grid__page-size-select"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>
      )}
      {renderFilterPopup()}
    </div>
  );
};

export default DataGrid;

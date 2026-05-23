import { useState, useEffect } from 'react';
import './style.scss';

const FormModal = ({ 
  isOpen, 
  title, 
  data = {}, 
  fields, 
  onSave, 
  onCancel,
  submitButtonText = 'Save',
  cancelButtonText = 'Cancel'
}) => {
  // Ensure fields is always an array and filter out null/undefined items
  const safeFields = Array.isArray(fields) && fields ? fields : [];
  const validFields = safeFields.filter(f => f && typeof f === 'object' && f.name);
  
  const [formData, setFormData] = useState(data || {});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(data);
      setErrors({});
    }
  }, [isOpen, data]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    validFields.forEach(field => {
      if (field.required) {
        const value = formData[field.name];
        
        if (!value || (typeof value === 'string' && !value.trim())) {
          newErrors[field.name] = `${field.label} is required`;
        } else if (field.type === 'number') {
          const numValue = Number(value);
          if (field.min !== undefined && numValue < field.min) {
            newErrors[field.name] = `${field.label} must be at least ${field.min}`;
          }
          if (field.max !== undefined && numValue > field.max) {
            newErrors[field.name] = `${field.label} must be at most ${field.max}`;
          }
        } else if (field.validate) {
          const error = field.validate(value, formData);
          if (error) {
            newErrors[field.name] = error;
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const renderField = (field) => {
    if (!field || !field.name) return null;
    
    const value = formData[field.name] || '';
    const hasError = errors[field.name];

    switch (field.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={hasError ? 'error' : ''}
            disabled={field.disabled}
          >
            {field.placeholder && <option value="">{field.placeholder}</option>}
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={hasError ? 'error' : ''}
            placeholder={field.placeholder}
            disabled={field.disabled}
            rows={field.rows || 4}
          />
        );

      default:
        return (
          <input
            type={field.type || 'text'}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={hasError ? 'error' : ''}
            placeholder={field.placeholder}
            disabled={field.disabled}
            min={field.min}
            max={field.max}
          />
        );
    }
  };

  if (!isOpen) return null;
  
  // Additional safety check
  if (!onSave || !onCancel) {
    console.error('FormModal: onSave and onCancel props are required');
    return null;
  }

  return (
    <div className="form-modal-overlay" onClick={handleOverlayClick}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-modal__header">
          <h2 className="form-modal__title">{title}</h2>
          <button 
            className="form-modal__close" 
            onClick={onCancel}
            type="button"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-modal__body">
            {validFields.map((field) => (
              <div key={field.name} className="form-modal__field">
                <label className="form-modal__label">
                  {field.label}
                  {field.required && <span className="form-modal__required">*</span>}
                </label>
                <div className="form-modal__input-wrapper">
                  {renderField(field)}
                  {errors[field.name] && (
                    <span className="form-modal__error">{errors[field.name]}</span>
                  )}
                  {field.helpText && !errors[field.name] && (
                    <span className="form-modal__help">{field.helpText}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="form-modal__footer">
            <button 
              type="button" 
              className="form-modal__btn form-modal__btn--cancel" 
              onClick={onCancel}
            >
              {cancelButtonText}
            </button>
            <button 
              type="submit" 
              className="form-modal__btn form-modal__btn--submit"
            >
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;

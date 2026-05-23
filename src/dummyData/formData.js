export const formOptions = {
  countries: [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' }
  ],
  languages: [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' }
  ],
  timeZones: [
    { value: 'UTC-8', label: 'Pacific Time (PT)' },
    { value: 'UTC-5', label: 'Eastern Time (ET)' },
    { value: 'UTC+0', label: 'Greenwich Mean Time (GMT)' },
    { value: 'UTC+1', label: 'Central European Time (CET)' }
  ],
  currencies: [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'JPY', label: 'Japanese Yen (¥)' }
  ]
};

export const validationRules = {
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: '^[a-zA-Z0-9_]*$'
  },
  email: {
    required: true,
    pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
  },
  password: {
    required: true,
    minLength: 8,
    hasUpperCase: true,
    hasLowerCase: true,
    hasNumber: true,
    hasSpecialChar: true
  },
  phone: {
    required: true,
    pattern: '^\\+?[1-9]\\d{1,14}$'
  }
};

export const formTemplates = {
  registration: {
    fields: [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        required: true,
        placeholder: 'Enter your first name'
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        required: true,
        placeholder: 'Enter your last name'
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        placeholder: 'Enter your email'
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        placeholder: 'Create a password'
      }
    ],
    buttons: [
      {
        type: 'submit',
        label: 'Register',
        variant: 'primary'
      },
      {
        type: 'reset',
        label: 'Clear',
        variant: 'secondary'
      }
    ]
  },
  profile: {
    fields: [
      {
        name: 'avatar',
        label: 'Profile Picture',
        type: 'file',
        accept: 'image/*'
      },
      {
        name: 'bio',
        label: 'Biography',
        type: 'textarea',
        placeholder: 'Tell us about yourself'
      },
      {
        name: 'birthDate',
        label: 'Birth Date',
        type: 'date'
      },
      {
        name: 'country',
        label: 'Country',
        type: 'select',
        options: 'countries'
      }
    ],
    buttons: [
      {
        type: 'submit',
        label: 'Save Changes',
        variant: 'primary'
      },
      {
        type: 'button',
        label: 'Cancel',
        variant: 'secondary'
      }
    ]
  }
};
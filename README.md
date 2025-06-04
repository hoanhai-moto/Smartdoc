# SmartDoc - Document Management System

SmartDoc is a comprehensive document management system designed for efficient handling of personal and office records, archives, document types, reports, statistics, and configurations.

## Features

- **Document Management**: Upload, manage, share, and archive documents
- **Role-Based Access**: Different permissions for different user roles
- **Personal and Office Records**: Separate sections for personal and office documents
- **Archive Management**: Store and retrieve archived documents
- **Document Types**: Support for various document types (notarized, certified, etc.)
- **Official Document Types**: Support for different official document types (outgoing, incoming, etc.)
- **Statistics and Reports**: Visualize and export data about documents and records
- **User Management**: Manage employees, departments, and job titles
- **Borrowing System**: Request, approve, and track document borrowing

## Technology Stack

### Backend
- Django (Python web framework)
- Django REST Framework (API)
- SQLite (Database)

### Frontend
- React (JavaScript library)
- React Router (Navigation)
- Axios (HTTP client)
- TailwindCSS (Styling)
- Chart.js (Data visualization)
- React Dropzone (File uploads)
- React Feather (Icons)

## Installation

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm 6+

### Backend Setup
1. Clone the repository
2. Create a virtual environment:
   ```bash
   python -m venv env
   ```
3. Activate the virtual environment:
   - Windows: `.\env\Scripts\activate`
   - Unix/MacOS: `source env/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Run migrations:
   ```bash
   python manage.py migrate
   ```
6. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```
7. Start the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Access the application at http://localhost:3000
2. Log in with your credentials
3. Navigate through the sidebar to access different features
4. Upload, manage, and share documents as needed

## Project Structure

```
smartdoc/
├── backend/
│   ├── documents/ (Django app for document management)
│   └── smartdoc/ (Django project settings)
└── frontend/
    ├── public/
    └── src/
        ├── assets/ (CSS, images)
        ├── components/ (Reusable React components)
        ├── context/ (React context providers)
        ├── pages/ (Page components)
        └── services/ (API services)
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Django](https://www.djangoproject.com/)
- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)
- [React Feather](https://github.com/feathericons/react-feather) 
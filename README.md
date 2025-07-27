# Human Capital Management (HCM) Application

This is a full-stack Human Capital Management application built with .NET 8+ backend and Angular frontend, following clean architecture principles and demonstrating best practices in software development.

## 🏗️ Architecture Overview

### Backend Structure (.NET 8+)

```
backend/
├── HCM.Api/          # Web API Layer (Controllers, Middleware)
├── HCM.Core/         # Domain/Business Logic Layer (Entities, Interfaces)
├── HCM.Infrastructure/ # Data Access Layer (EF Core, Repositories)
└── HCM.Tests/        # Unit and Integration Tests (xUnit)
```

### Frontend Structure (Angular)

```
frontend/
├── src/app/          # Angular application
├── src/assets/       # Static assets
├── src/environments/ # Environment configurations
└── public/           # Public files
```

## 🚀 Technology Stack

### Backend

-   **.NET 8+** - Core framework
-   **ASP.NET Core** - Web API framework
-   **Entity Framework Core** - ORM for data access
-   **PostgreSQL** - Primary database
-   **JWT Authentication** - Security implementation
-   **Swagger/OpenAPI** - API documentation
-   **xUnit** - Testing framework

### Frontend

-   **Angular 19+** - Frontend framework
-   **TypeScript** - Type-safe JavaScript
-   **SCSS** - Styling
-   **RxJS** - Reactive programming

### Development Environment

-   **Nix Shell** - Reproducible development environment
-   **PostgreSQL** - Database system
-   **Node.js** - JavaScript runtime for Angular

## 📋 Core Requirements Implementation

### 1. Database Design & CRUD Operations

-   Employee records with fields: First Name, Last Name, Email, Job Title, Salary, Department
-   Full CRUD operations for all main entities
-   Entity Framework Core with PostgreSQL provider
-   Database migrations support

### 2. Authentication & Authorization

-   JWT-based authentication system
-   Role-based authorization with three user roles:
    -   **Employee**: Can view their own profile only
    -   **Manager**: Can view and edit all people in their department
    -   **HR Admin**: Can manage all people records
-   Protected API endpoints based on user roles

### 3. Frontend Layer

-   Angular-based user interface
-   Features for listing, creating, editing, and deleting records
-   User authentication and profile management
-   Role-based UI access control

## 🛠️ Setup Instructions

### Prerequisites

-   **Nix Package Manager** installed on your system
-   Git for version control

### Development Environment Setup

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd HCM
    ```

2. **Enter the Nix development shell:**

    ```bash
    nix-shell
    ```

    This will automatically install all required dependencies:

    - .NET SDK 8
    - Node.js 20
    - PostgreSQL 17
    - Angular CLI
    - Development tools

3. **Restore .NET packages:**

    ```bash
    cd backend
    dotnet restore
    ```

4. **Install Angular dependencies:**
    ```bash
    cd frontend
    npm install
    ```

### Database Setup

1. **Start PostgreSQL service:**

    ```bash
    # In nix-shell environment
    initdb -D ~/.local/share/postgres
    pg_ctl -D ~/.local/share/postgres -l ~/.local/share/postgres/logfile start
    createdb hcm_development
    ```

2. **Configure connection string in `appsettings.Development.json`:**

    ```json
    {
        "ConnectionStrings": {
            "DefaultConnection": "Host=localhost;Database=hcm_development;Username=your_username"
        }
    }
    ```

3. **Run database migrations:**
    ```bash
    cd backend/HCM.Api
    dotnet ef database update
    ```

### Running the Application

1. **Start the backend API:**

    ```bash
    cd backend/HCM.Api
    dotnet run
    ```

    API will be available at: `https://localhost:7001` or `http://localhost:5001`

2. **Start the Angular frontend:**
    ```bash
    cd frontend
    ng serve
    ```
    Frontend will be available at: `http://localhost:4200`

### Building for Production

1. **Build backend:**

    ```bash
    cd backend
    dotnet build --configuration Release
    ```

2. **Build frontend:**
    ```bash
    cd frontend
    npm run build
    ```

### Running Tests

1. **Backend tests:**

    ```bash
    cd backend
    dotnet test
    ```

2. **Frontend tests:**
    ```bash
    cd frontend
    npm test
    ```

## 📦 Package Dependencies

### .NET Backend Packages

-   `Microsoft.EntityFrameworkCore` - ORM framework
-   `Npgsql.EntityFrameworkCore.PostgreSQL` - PostgreSQL provider
-   `Microsoft.AspNetCore.Authentication.JwtBearer` - JWT authentication
-   `Microsoft.EntityFrameworkCore.Design` - EF Core tooling
-   `xunit` - Testing framework

### Angular Frontend Packages

-   `@angular/core` - Angular framework
-   `@angular/router` - Routing
-   `@angular/common` - Common utilities
-   `rxjs` - Reactive programming
-   `typescript` - TypeScript support

## 🔧 Development Tools

The `shell.nix` file provides a complete development environment with:

-   .NET SDK 8.0.412
-   Node.js 20.x
-   npm package manager
-   Angular CLI
-   PostgreSQL 17
-   Git and development utilities
-   Docker for containerization (optional)

## 📝 API Endpoints

Once the backend is running, you can access:

-   **Swagger UI**: `https://localhost:7001/swagger`
-   **API Base URL**: `https://localhost:7001/api`

### Main API Routes (to be implemented)

-   `GET/POST /api/employees` - Employee management
-   `GET/POST /api/departments` - Department management
-   `POST /api/auth/login` - Authentication
-   `POST /api/auth/register` - User registration

## 🐳 Docker Support (Optional)

The development environment includes Docker for containerization. You can create Docker containers for both frontend and backend applications.

## 🧪 Testing Strategy

-   **Unit Tests**: Testing individual components and services
-   **Integration Tests**: Testing API endpoints and database interactions
-   **E2E Tests**: Testing complete user workflows

## 📈 Future Enhancements

Optional enhancements that can be added:

-   **Monitoring**: Grafana/Prometheus integration
-   **Advanced Identity**: Custom JWT implementation
-   **Microservices**: Split into multiple APIs
-   **Caching**: Redis integration
-   **File Upload**: Document management
-   **Notifications**: Email/SMS notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is for educational and demonstration purposes.

---

**Note**: This project follows clean architecture principles, SOLID design patterns, and implements modern development practices for enterprise-level applications.

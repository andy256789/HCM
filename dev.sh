#!/usr/bin/env bash

# Development Scripts for HCM Application

case "$1" in
    "setup")
        echo "🚀 Setting up HCM development environment..."
        
        # Restore .NET packages
        echo "📦 Restoring .NET packages..."
        cd backend && dotnet restore && cd ..
        
        # Install Angular dependencies
        echo "📦 Installing Angular dependencies..."
        cd frontend && npm install && cd ..
        
        echo "✅ Setup complete! Run './dev.sh start' to start the application."
        ;;
        
    "start")
        echo "🚀 Starting HCM application..."
        
        # Start backend in background
        echo "🔧 Starting .NET API..."
        cd backend/HCM.Api
        dotnet run &
        BACKEND_PID=$!
        cd ../..
        
        # Wait a moment for backend to start
        sleep 3
        
        # Start frontend
        echo "🎨 Starting Angular frontend..."
        cd frontend
        npm start &
        FRONTEND_PID=$!
        cd ..
        
        echo "✅ Application started!"
        echo "📱 Frontend: http://localhost:4200"
        echo "🔧 Backend API: https://localhost:7001"
        echo "📚 Swagger: https://localhost:7001/swagger"
        echo ""
        echo "Press Ctrl+C to stop both services"
        
        # Wait for user interrupt
        trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
        wait
        ;;
        
    "build")
        echo "🔨 Building HCM application..."
        
        # Build backend
        echo "🔧 Building .NET API..."
        cd backend && dotnet build --configuration Release && cd ..
        
        # Build frontend
        echo "🎨 Building Angular frontend..."
        cd frontend && npm run build && cd ..
        
        echo "✅ Build complete!"
        ;;
        
    "test")
        echo "🧪 Running tests..."
        
        # Test backend
        echo "🔧 Testing .NET API..."
        cd backend && dotnet test && cd ..
        
        # Test frontend
        echo "🎨 Testing Angular frontend..."
        cd frontend && npm test -- --no-watch --no-progress --browsers=ChromeHeadless && cd ..
        
        echo "✅ Tests complete!"
        ;;
        
    "clean")
        echo "🧹 Cleaning build artifacts..."
        
        # Clean .NET
        cd backend && dotnet clean && cd ..
        
        # Clean Angular
        cd frontend && rm -rf node_modules dist .angular && cd ..
        
        echo "✅ Clean complete!"
        ;;
        
    "db:migrate")
        echo "🗄️ Running database migrations..."
        cd backend/HCM.Api && dotnet ef database update && cd ../..
        ;;
        
    "db:reset")
        echo "🗄️ Resetting database..."
        cd backend/HCM.Api && dotnet ef database drop --force && dotnet ef database update && cd ../..
        ;;
        
    *)
        echo "🔧 HCM Development Helper"
        echo ""
        echo "Usage: ./dev.sh [command]"
        echo ""
        echo "Commands:"
        echo "  setup         - Install all dependencies"
        echo "  start         - Start both frontend and backend"
        echo "  build         - Build both frontend and backend"
        echo "  test          - Run all tests"
        echo "  clean         - Clean all build artifacts"
        echo "  db:migrate    - Run database migrations"
        echo "  db:reset      - Reset database"
        echo ""
        echo "Prerequisites:"
        echo "  - Run 'nix-shell' first to enter development environment"
        echo "  - Configure PostgreSQL connection string in appsettings.Development.json"
        ;;
esac

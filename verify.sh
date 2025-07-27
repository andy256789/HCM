#!/usr/bin/env bash

echo "🔍 HCM Project Structure Verification"
echo "====================================="
echo ""

# Check if we're in nix-shell
if [ -z "$IN_NIX_SHELL" ]; then
    echo "⚠️  Warning: Not in nix-shell environment"
    echo "   Run 'nix-shell' first for best experience"
    echo ""
fi

# Check project structure
echo "📁 Project Structure:"
echo "   ✅ Backend structure:"
if [ -d "backend/HCM.Api" ]; then echo "      ✅ HCM.Api (Web API)"; else echo "      ❌ HCM.Api missing"; fi
if [ -d "backend/HCM.Core" ]; then echo "      ✅ HCM.Core (Domain)"; else echo "      ❌ HCM.Core missing"; fi
if [ -d "backend/HCM.Infrastructure" ]; then echo "      ✅ HCM.Infrastructure (Data)"; else echo "      ❌ HCM.Infrastructure missing"; fi
if [ -d "backend/HCM.Tests" ]; then echo "      ✅ HCM.Tests (Testing)"; else echo "      ❌ HCM.Tests missing"; fi

echo "   ✅ Frontend structure:"
if [ -d "frontend/src" ]; then echo "      ✅ Angular frontend"; else echo "      ❌ Angular frontend missing"; fi

echo ""

# Check important files
echo "📄 Configuration Files:"
if [ -f "shell.nix" ]; then echo "   ✅ shell.nix (Development environment)"; else echo "   ❌ shell.nix missing"; fi
if [ -f "HCM.sln" ]; then echo "   ✅ HCM.sln (Solution file)"; else echo "   ❌ HCM.sln missing"; fi
if [ -f "docker-compose.yml" ]; then echo "   ✅ docker-compose.yml (Database)"; else echo "   ❌ docker-compose.yml missing"; fi
if [ -f "dev.sh" ]; then echo "   ✅ dev.sh (Development scripts)"; else echo "   ❌ dev.sh missing"; fi
if [ -f "README.md" ]; then echo "   ✅ README.md (Documentation)"; else echo "   ❌ README.md missing"; fi

echo ""

# Check if tools are available
echo "🛠️  Available Tools:"
if command -v dotnet &> /dev/null; then
    echo "   ✅ .NET SDK: $(dotnet --version)"
else
    echo "   ❌ .NET SDK not found"
fi

if command -v node &> /dev/null; then
    echo "   ✅ Node.js: $(node --version)"
else
    echo "   ❌ Node.js not found"
fi

if command -v npm &> /dev/null; then
    echo "   ✅ npm: $(npm --version)"
else
    echo "   ❌ npm not found"
fi

if command -v ng &> /dev/null; then
    echo "   ✅ Angular CLI available"
else
    echo "   ❌ Angular CLI not found (run 'npm install -g @angular/cli')"
fi

if command -v psql &> /dev/null; then
    echo "   ✅ PostgreSQL client available"
else
    echo "   ❌ PostgreSQL client not found"
fi

echo ""

# Check dependencies
echo "🔗 Dependencies:"
if [ -d "frontend/node_modules" ]; then
    echo "   ✅ Angular dependencies installed"
else
    echo "   ⚠️  Angular dependencies not installed (run 'cd frontend && npm install')"
fi

if [ -d "backend/HCM.Api/bin" ]; then
    echo "   ✅ .NET dependencies restored"
else
    echo "   ⚠️  .NET dependencies not restored (run 'cd backend && dotnet restore')"
fi

echo ""

# Quick start guide
echo "🚀 Quick Start:"
echo "   1. Enter nix-shell:     nix-shell"
echo "   2. Setup dependencies:  ./dev.sh setup"
echo "   3. Start database:      docker-compose up -d postgres"
echo "   4. Run migrations:      ./dev.sh db:migrate"
echo "   5. Start application:   ./dev.sh start"
echo ""
echo "   Frontend: http://localhost:4200"
echo "   Backend:  https://localhost:7001"
echo "   Swagger:  https://localhost:7001/swagger"
echo "   PgAdmin:  http://localhost:8080 (admin@hcm.local / admin123)"
echo ""

# Technology stack
echo "📚 Technology Stack:"
echo "   Backend:  .NET 8, ASP.NET Core, Entity Framework Core, PostgreSQL, JWT"
echo "   Frontend: Angular 19, TypeScript, SCSS, RxJS"
echo "   Testing:  xUnit (.NET), Jasmine/Karma (Angular)"
echo "   DevOps:   Nix, Docker, PostgreSQL"
echo ""

echo "✅ Project verification complete!"
echo "   For detailed instructions, see README.md"

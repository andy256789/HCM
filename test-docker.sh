#!/usr/bin/env bash

echo "🔍 Testing Docker Setup for HCM Project"
echo "======================================="

# Test Docker daemon
echo "1. Testing Docker daemon..."
if sudo docker info > /dev/null 2>&1; then
    echo "   ✅ Docker daemon is running"
else
    echo "   ❌ Docker daemon is not accessible"
    exit 1
fi

# Test Docker Compose
echo "2. Testing Docker Compose configuration..."
if sudo docker compose config > /dev/null 2>&1; then
    echo "   ✅ Docker Compose configuration is valid"
else
    echo "   ❌ Docker Compose configuration has issues"
    exit 1
fi

# Check for port conflicts
echo "3. Checking for port conflicts..."
if sudo ss -tlnp | grep :5433 > /dev/null 2>&1; then
    echo "   ⚠️  Port 5433 is already in use"
    echo "   📝 You may need to stop existing services or change the port"
else
    echo "   ✅ Port 5433 is available"
fi

# Test starting PostgreSQL
echo "4. Testing PostgreSQL container startup..."
if sudo docker compose up -d postgres; then
    echo "   ✅ PostgreSQL container started successfully"
    
    # Wait for PostgreSQL to be ready
    echo "5. Waiting for PostgreSQL to be ready..."
    sleep 10
    
    # Test PostgreSQL connection
    if sudo docker compose exec postgres pg_isready -U hcm_user -d hcm_development; then
        echo "   ✅ PostgreSQL is ready and accepting connections"
    else
        echo "   ⚠️  PostgreSQL might still be initializing"
    fi
    
    # Show container status
    echo "6. Container status:"
    sudo docker compose ps
    
    # Clean up
    echo "7. Stopping test containers..."
    sudo docker compose down
    echo "   ✅ Test containers stopped"
    
else
    echo "   ❌ Failed to start PostgreSQL container"
    exit 1
fi

echo ""
echo "✅ Docker setup is working correctly!"
echo "📝 Next steps:"
echo "   - Run: sudo docker compose up -d postgres    # Start database"
echo "   - Run: sudo docker compose up -d pgadmin     # Start PgAdmin"
echo "   - Access PgAdmin at: http://localhost:8080"
echo "   - Database available at: localhost:5433"
echo "   - Login with: admin@hcm.local / admin123"

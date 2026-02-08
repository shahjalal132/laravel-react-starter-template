#!/bin/bash

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Function to print colored messages
print_step() {
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${WHITE}📦 STEP $1: $2${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ Error: $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

print_warning() {
    echo -e "${MAGENTA}⚠ $1${NC}"
}

# Header
clear
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║        Laravel + React Starter Template Setup Script         ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Step 1: Install Composer Dependencies
print_step "1" "Installing Composer Dependencies"
print_info "Running: composer install"
if composer install; then
    print_success "Composer dependencies installed successfully!"
else
    print_error "Failed to install composer dependencies"
    exit 1
fi
echo ""

# Step 2: Install NPM Dependencies
print_step "2" "Installing NPM Dependencies"
print_info "Running: npm install"
if npm install; then
    print_success "NPM dependencies installed successfully!"
else
    print_error "Failed to install npm dependencies"
    exit 1
fi
echo ""

# Step 3: Build Frontend
print_step "3" "Building Frontend Assets"
print_info "Running: npm run build"
if npm run build; then
    print_success "Frontend assets built successfully!"
else
    print_error "Failed to build frontend assets"
    exit 1
fi
echo ""

# Step 4: Copy Environment File
print_step "4" "Setting Up Environment Configuration"
if [ -f .env ]; then
    print_warning ".env file already exists. Skipping copy."
else
    print_info "Copying .env.example to .env"
    if cp .env.example .env; then
        print_success "Environment file created successfully!"
    else
        print_error "Failed to create .env file"
        exit 1
    fi
fi
echo ""

# Step 5: Generate Application Key
print_step "5" "Generating Application Key"
print_info "Running: php artisan key:generate"
if php artisan key:generate; then
    print_success "Application key generated successfully!"
else
    print_error "Failed to generate application key"
    exit 1
fi
echo ""

# Step 6: Run Migrations
print_step "6" "Running Database Migrations"
print_info "Running: php artisan migrate"
print_warning "Make sure your database is configured in .env file"
if php artisan migrate; then
    print_success "Database migrations completed successfully!"
else
    print_error "Failed to run migrations. Please check your database configuration."
    exit 1
fi
echo ""

# Step 7: Run Seeders
print_step "7" "Seeding Database"
print_info "Running: php artisan db:seed"
if php artisan db:seed; then
    print_success "Database seeded successfully!"
else
    print_error "Failed to seed database"
    exit 1
fi
echo ""

# Required files permission
print_step "8" "Setting File Permissions"
print_info "Setting permissions for storage and bootstrap/cache..."
# Set 775 permissions for storage and bootstrap/cache directories
# standard for Laravel to allow web server + user write access
if chmod -R 777 storage bootstrap/cache; then
    print_success "Permissions set successfully!"
else
    print_warning "Could not set permissions automatically. You might need to run: sudo chmod -R 777 storage bootstrap/cache"
fi
echo ""

# Environment Selection
print_step "9" "Environment Configuration"
echo -e "${CYAN}Please select your environment:${NC}"
echo -e "1) ${GREEN}Local${NC} (Runs dev server)"
echo -e "2) ${RED}Production${NC} (Exits without running server)"
echo ""
read -p "Enter choice [1-2]: " env_choice

echo ""
if [ "$env_choice" == "1" ]; then
    # Step 10: Start Development Server
    print_step "10" "Starting Development Server"
    print_info "Running: composer run dev"
    
    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                               ║${NC}"
    echo -e "${GREEN}║  Your Laravel + React application is ready!                   ║${NC}"
    echo -e "${GREEN}║                                                               ║${NC}"
    echo -e "${GREEN}║  The development server will start now...                    ║${NC}"
    echo -e "${GREEN}║                                                               ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    print_info "Press Ctrl+C to stop the server"
    echo ""

    composer run dev
else
    print_success "Setup completed successfully! 🚀"
    print_info "You can manually start the server with: composer run dev"
fi
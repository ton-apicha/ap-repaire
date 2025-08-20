# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-08-20

### ✅ Fixed
- **Translation Issues**: Fixed display of `workOrders.status.COMPLETED` and `workOrders.priority.HIGH`
  - Added `getStatusText()` and `getPriorityText()` functions
  - Fixed status and priority display in Dashboard, Work Orders, and Detail pages
  - Added support for `WAITING_PARTS` status
- **Search Bar Consistency**: Made search bars consistent across all pages
  - Fixed Customers page search bar styling
  - Unified search bar appearance across Dashboard, Customers, Technicians, and Work Orders
- **Table Responsiveness**: Improved table display and scrolling
  - Added `overflow-x-auto` for horizontal scrolling
  - Enhanced responsive design for mobile devices
  - Fixed table layout issues
- **UI/UX Improvements**: Enhanced overall user experience
  - Fixed input text visibility (no more gray text)
  - Improved focus states and form styling
  - Enhanced modal designs and interactions

### 🔧 Added
- **Testing Scripts**: Added comprehensive testing tools
  - `test-display-issues.js` - For identifying display problems
  - `test-display-fixes.js` - For testing fixes and improvements
- **Documentation**: Enhanced project documentation
  - `DISPLAY_ISSUES_FIXES.md` - Comprehensive fix documentation
  - Updated README.md with latest features
  - Added deployment instructions for Docker
- **Language Support**: Improved multi-language support
  - Better translation handling for status and priority values
  - Enhanced language switching functionality

### 📋 Technical Improvements
- **Code Quality**: Improved code structure and maintainability
  - Centralized translation functions
  - Better error handling
  - Enhanced type safety
- **Performance**: Optimized rendering and data handling
  - Improved data fetching
  - Better state management
  - Enhanced caching

### 🚀 Deployment
- **Docker Support**: Added Docker configuration
  - Dockerfile for containerization
  - Docker Compose for local development
  - Production-ready container setup
- **CI/CD**: Enhanced deployment pipeline
  - GitHub Actions workflow
  - Vercel deployment configuration
  - Railway deployment support

## [1.0.0] - 2025-08-19

### 🎉 Initial Release
- **Core Features**: Complete repair management system
  - Customer management with CRUD operations
  - Technician management with specializations
  - Work order management with status tracking
  - Miner model management for Bitcoin mining machines
  - Dashboard with statistics and overview
- **Authentication**: Secure user authentication system
  - NextAuth.js integration
  - Role-based access control (Admin, Manager, Technician)
  - Session management
- **Multi-language Support**: Internationalization
  - English, Thai, and Chinese language support
  - Dynamic language switching
  - Comprehensive translation coverage
- **Database**: Robust data management
  - SQLite with Prisma ORM
  - Comprehensive data models
  - Seed data for testing
- **UI/UX**: Modern and responsive design
  - Tailwind CSS styling
  - Heroicons integration
  - Mobile-responsive layout
  - Professional sidebar navigation

### 🔧 Technical Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Icons**: Heroicons
- **State Management**: React Context

### 📋 Features
- **Dashboard**: Overview with statistics and recent work orders
- **Customer Management**: Complete CRUD operations
- **Technician Management**: Specialization and hourly rate tracking
- **Work Order Management**: Status tracking, priority levels, cost estimation
- **Miner Model Management**: Support for Bitmain, Whatsminer, Avalon
- **Admin Panel**: User management and system settings
- **Multi-language**: English, Thai, Chinese support
- **Responsive Design**: Works on desktop, tablet, and mobile

---

## Version History

- **v1.1.0** (2025-08-20): Display fixes, UI improvements, testing tools
- **v1.0.0** (2025-08-19): Initial release with core features

## Contributing

When contributing to this project, please update this changelog with a new entry under the appropriate version section.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

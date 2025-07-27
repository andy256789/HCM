YOU ARE TASKED WITH BUILDING A HUMAN CAPITAL MANAGEMENT (HCM) APPLICATION USING .NET.
THIS PROJECT AIMS TO SIMULATE A REAL-WORLD SOLUTION FOR HR TEAMS IN SMALL TO MEDIUM COMPANIES,
COVERING ESSENTIAL HR WORKFLOWS SUCH AS MANAGING EMPLOYEE RECORDS, DEPARTMENTS, AND SALARY
INFORMATION. THE APPLICATION SHOULD BE WELL-STRUCTURED, SCALABLE, AND DEMONSTRATE BEST PRACTICES IN
SOFTWARE DEVELOPMENT.
Core Requirements

1. DATABASE DESIGN & CORE CRUD OPERATIONS:
   o DESIGN THE DATABASE SCHEMA
   o IMPLEMENT CRUD (CREATE, READ, UPDATE, DELETE) OPERATIONS FOR EACH MAIN ENTITY
   o USE ORM BY YOUR CHOICE FOR DATA ACCESS – ENTITY FRAMEWORK CORE OR ANY OTHER
   o EACH PERSON RECORD SHOULD CONTAIN AT LEAST THE FOLLOWING FIELDS:
   ▪ FIRST NAME
   ▪ LAST NAME
   ▪ EMAIL
   ▪ JOB TITLE
   ▪ SALARY
   ▪ DEPARTMENT

2. AUTHENTICATION, AUTHORIZATION, AND USER ROLES:
   o IMPLEMENT AUTHENTICATION (LOGIN/LOGOUT) FOR USERS
   o SET UP AUTHORIZATION WITH AT LEAST TWO USER ROLES OF THE BELOW:
   ▪ EMPLOYEE (CAN VIEW THEIR OWN PROFILE ONLY)
   ▪ MANAGER (CAN VIEW AND EDIT ALL PEOPLE IN THE DEPARTMENT)
   ▪ HR ADMIN (CAN MANAGE ALL PEOPLE RECORDS)
   o PROTECT API ENDPOINTS BASED ON USER ROLES

3. FRONTEND LAYER – USER INTERFACE:
   o DEVELOP A FRONTEND (WEB UI) TO INTERACT WITH THE BACKEND APIS
   ▪ USE A FRAMEWORK SUCH AS ASP.NET CORE MVC, RAZOR PAGES, OR A MODERN
   JAVASCRIPT FRAMEWORK
   o IMPLEMENT UI FEATURES TO:
   ▪ LIST, CREATE, EDIT, AND DELETE PEOPLE, DEPARTMENTS, AND SALARY RECORDS
   ▪ DISPLAY USER INFORMATION AND PERMISSIONS
   ▪ ALLOW USERS TO LOG IN AND LOG OUT
   Technical Requirements
   Angular
   .NET 8+
   SQL Database
   Additional Information
   • Documentation: All assignments should be uploaded to a public GitHub repository with a proper and
   well structured “README.md” file. Repository name is up to you to decide.
   • API Communication: The application should have at least two APIs (e.g., backend and frontend), but
   you can start with a single API and split as you progress
   • Production-Ready Quality: Focus on clean code, error handling, and logging
   • Other: There is no specific restriction on using third party libraries for the project. It’s important to
   choose your third-party libraries wisely so they don’t come with huge overhead in usage.
   Optional Enhancements
   • Containerization: Docker support is encouraged for deployment consistency
   • Testing: Writing unit tests (xUnit/NUnit)
   • API Documentation: Swagger/OpenAPI integration
   • Monitoring: implemented with Grafana or Prometheus
   • Advanced Identity: custom JWT implementation

# 🚀 Spring Boot Learning Roadmap & Projects

This repository contains my Spring Boot practice projects, tracking my journey from beginner basics to building REST APIs and full-stack web applications.

---

## 🗺️ Master Project Roadmap

- [x] **Project 0: Simple Calculator** (Completed ✅)
  - Basics of `@RequestParam`, `@GetMapping`, HTML forms & CSS.
- [/] **Project 1: Employee Management System** (In Progress 🟢)
  - Full-stack CRUD application using Spring Boot, Spring Data JPA, H2 Database, and HTML/JS frontend.
- [x] **Project 2: Personal Task / Todo Tracker** (Completed ✅)
  - RESTful APIs with `@RestController`, `@RequestMapping("/todos")`, Spring Data JPA, and H2 database integration.
- [ ] **Project 3: Note-Taking REST API** (Planned 📅)
  - Pure Backend API with search & tagging functionality, tested using Postman / Swagger UI.

---

## 💼 Project 1: Employee Management System

### 📌 Architecture Overview
```
src/main/java/com/coding/ems_project/
├── model/           -> Entity representing Database Tables (Employee.java)
├── repository/      -> Data Access Layer using Spring Data JPA
├── service/         -> Business Logic Layer
└── controller/      -> Web REST API Controller Layer
```

### 📋 Progress Tracker
**Current Status: 🟢 Step 1 - Entity Layer Setup**

- [ ] **Step 1: Entity Layer** (`Employee.java`)
  - Define `id`, `name`, `phone`, `email`
  - Annotate with `@Entity`, `@Id`, `@GeneratedValue`
- [ ] **Step 2: Repository Layer** (`EmployeeRepository.java`)
  - Create interface extending `JpaRepository`
- [ ] **Step 3: Service Layer** (`EmployeeService.java` & `EmployeeServiceImpl.java`)
  - Business logic to create, read, update, and delete employees
- [ ] **Step 4: Controller Layer** (`EmployeeController.java`)
  - Expose REST API endpoints (`/employees`)
- [ ] **Step 5: Frontend UI** (`index.html`, `style.css`, `script.js`)
  - Form to add employee & table to view/delete employees

---

## ✅ Project 2: Personal Task / Todo Tracker

### 📌 Architecture Overview
```
src/main/java/com/code/Todo/
├── model/           -> Entity representing Database Tables (Todo.java)
├── repository/      -> Data Access Layer using Spring Data JPA (TodoRepository.java)
├── service/         -> Business Logic Layer (TodoService.java)
├── controller/      -> Web REST API Controller Layer (TodoController.java)
└── TodoApplication.java -> Main Spring Boot Application Entrypoint
```

### 📡 REST API Endpoints

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/todos` | Fetch all Todos |
| `GET` | `/todos/{id}` | Fetch a Todo by ID |
| `POST` | `/todos` | Create a new Todo |
| `PUT` | `/todos/{id}` | Update an existing Todo |
| `DELETE` | `/todos/{id}` | Delete a Todo by ID |

### 📋 Progress Tracker
**Current Status: ✅ Completed**

- [x] **Step 1: Entity Layer** (`Todo.java`)
  - Defined `id`, `title`, `description`, `completed`
  - Configured `@Entity`, `@Id`, `@GeneratedValue(strategy = GenerationType.IDENTITY)`
- [x] **Step 2: Repository Layer** (`TodoRepository.java`)
  - Created interface extending `JpaRepository<Todo, Long>`
- [x] **Step 3: Service Layer** (`TodoService.java`)
  - Implemented business logic for all CRUD operations
- [x] **Step 4: Controller Layer** (`TodoController.java`)
  - Exposed REST API endpoints under `/todos` with `@CrossOrigin` enabled
- [x] **Step 5: Database & Build Configuration** (`application.properties` & `pom.xml`)
  - Configured H2 in-memory database with H2 console access enabled

---

## 📝 Work History Log

### 🗓️ 2026-08-11
* **Todo Tracker App (Project 2):** Completed full backend CRUD REST API using Spring Boot, Spring Data JPA, and H2 database.
* **Build & Import Fixes:** Resolved missing imports in `TodoController.java`, corrected return type in `TodoService.java`, configured H2 properties in `application.properties`, and updated Lombok versioning in `pom.xml`.
* **Roadmap Update:** Marked Project 2 as Completed ✅ in `README.md`.

### 🗓️ 2026-08-10
* **Calculator App:** Completed basic calculator using HTML forms and Spring Controller.
* **Roadmap Setup:** Created master `README.md` tracking all projects.


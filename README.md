[README.md](https://github.com/user-attachments/files/33501610/README.md)
# QuizNova

**Java-Based Online Quiz and Performance Management System**

QuizNova lets students register, take timed quizzes, receive automatic results and track their performance over time. Instructors (admins) create quizzes and questions and review every student's results.

The project has two parts:

| Part | Folder | Stack | Role |
| :--- | :--- | :--- | :--- |
| Web UI | `/` (root) | React 19, TypeScript, Vite, Tailwind CSS v4 | Student and admin interface |
| Java backend | `backend/` | Java 17, Jakarta Servlets 6, JDBC + HikariCP, MySQL 8, Maven, Tomcat 10+ | Authentication, quiz APIs, grading, persistence |

---

## Features

### Students
- Register and log in
- Dashboard with quizzes taken, average score, best score and a score trend chart
- Quiz library with search and category / difficulty filters
- Timed quiz screen with live countdown, question navigator, mark for review and auto-submit when time runs out
- Result screen with score ring, correct / wrong / skipped breakdown, time taken and answer review with explanations
- Performance page with attempt history and category-wise accuracy
- Class leaderboard

### Admins
- Dashboard with total students, quizzes and attempts
- Create, edit and delete quizzes and multiple-choice questions
- View all student results with filters and export to CSV

### Interface
- Light and dark themes
- Responsive layout (sidebar on desktop, bottom navigation on mobile)
- Toast notifications, confirmation dialogs, empty and loading states

---

## Architecture

```
React UI  ->  Servlets (JSON API)  ->  Service layer  ->  DAO layer (JDBC)  ->  MySQL
                  |                        |
              AuthFilter             GradingExecutionService
            (HttpSession)           (thread pool, synchronized leaderboard)
```

### Java concepts demonstrated (`backend/`)

| Concept | Where |
| :--- | :--- |
| OOP: encapsulation, abstraction, inheritance, polymorphism | `Person` (abstract), `User`, `Student`, `Admin`, `Gradable` interface |
| Collections and Generics | `QuizService`, `GradingExecutionService`, generic `Result<T>` |
| Exception handling | `QuizNovaException` hierarchy (`InvalidQuizException`, `QuizNotFoundException`, `AuthenticationException`) |
| Multithreading and synchronization | `GradingExecutionService` (`ExecutorService`, `synchronized` leaderboard, `ConcurrentHashMap`) |
| JDBC | `UserDAO`, `QuizDAO`, `QuestionDAO`, `AttemptDAO` (`PreparedStatement`, transactions, batch inserts, try-with-resources) |
| Servlets and web integration | `LoginServlet`, `RegisterServlet`, `LogoutServlet`, `QuizListServlet`, `SubmitQuizServlet`, `ResultServlet`, `AdminQuizServlet`, `AuthFilter`, `HttpSession` |

### Database tables

`users`, `quizzes`, `questions`, `attempts`, `attempt_answers` (full DDL and sample data in `backend/src/main/resources/schema.sql`).

---

## Project structure

```
.
├── src/                    # React frontend
│   ├── components/         # layout, charts, auth, common UI
│   ├── views/              # landing, student and admin screens
│   ├── context/            # auth, theme, toast providers
│   └── services/           # storage service and seed data
├── backend/                # Java Servlet + JDBC backend
│   ├── pom.xml
│   ├── README.md           # detailed backend guide and API reference
│   └── src/main/
│       ├── java/com/quiznova/{model,dao,service,servlet,filter,exception,util}
│       ├── resources/{schema.sql,db.properties}
│       └── webapp/WEB-INF/web.xml
├── index.html
├── package.json
└── README.md
```

---

## Requirements

- Node.js 18 or newer (for the web UI)
- JDK 17 or newer, Maven 3.8+, MySQL 8.0 and Apache Tomcat 10.1+ (for the backend)

---

## Run the web UI

```bash
npm install
npm run dev
```

Open http://localhost:3000.

The UI stores its data in the browser's `localStorage`, using collections that mirror the MySQL tables (users, quizzes, questions, attempts), so it works on its own for demos without a server.

### Demo accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| Admin | `admin@quiznova.com` | `admin123` |
| Student | `alex@example.com` | `student123` |
| Student | `priya@example.com` | `student123` |

---

## Run the Java backend

1. Create the database and load the sample data:
   ```bash
   mysql -u root -p < backend/src/main/resources/schema.sql
   ```
2. Set your MySQL username and password in `backend/src/main/resources/db.properties`.
3. Build the WAR file:
   ```bash
   cd backend
   mvn clean package
   ```
4. Copy `target/quiznova.war` into Tomcat's `webapps/` folder and start Tomcat.
5. The API is served at `http://localhost:8080/quiznova/api/...`

### API overview

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in and start a session |
| POST | `/api/auth/logout` | End the session |
| GET | `/api/quizzes`, `/api/quizzes/{id}` | List quizzes, get a quiz with its questions |
| POST | `/api/quizzes/submit` | Submit answers for automatic grading |
| GET | `/api/results`, `/api/results/{id}` | Attempt history and single result |
| GET | `/api/results/leaderboard` | Class ranking |
| POST / PUT / DELETE | `/api/admin/quizzes` | Admin quiz management (admin session required) |

See [`backend/README.md`](backend/README.md) for request and response examples.

---

## Tech stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, Motion, Lucide icons, canvas-confetti
**Backend:** Java 17, Jakarta Servlet 6, JDBC, HikariCP, Gson, MySQL, Maven, Tomcat

---

## Future scope

- Connect the React UI to the Servlet API, replacing the browser storage calls with HTTP requests
- Password hashing and role-based route protection on every endpoint
- Question banks with random selection and shuffling
- Email notifications and downloadable PDF score reports

---

## Author

Akshat, GUVI x HCL Java project

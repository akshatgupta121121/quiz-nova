# QuizNova — Java-Based Online Quiz & Performance Management System

A production-grade, enterprise Java web backend built with **Java 17**, **Jakarta Servlet 6.0**, **MySQL 8.0**, **JDBC with HikariCP**, and designed for deployment on **Apache Tomcat 10+**.

---

## 1. Architectural Overview & Concepts Demonstrated

This backend was built to showcase core and advanced Java software engineering principles across six fundamental competencies:

| Category | Java Concept | Implementing Classes | Architectural Responsibility |
| :--- | :--- | :--- | :--- |
| **OOP** | **Encapsulation** | `Person.java`, `Quiz.java`, `Question.java`, `Attempt.java` | Private attributes protected by getters/setters and domain validations. |
| **OOP** | **Abstraction** | `Person.java` (abstract class), `Gradable.java` (interface) | Enforces unified identity and grading contract (`calculateGrade`, `isPassing`). |
| **OOP** | **Inheritance** | `User extends Person`, `Student extends User`, `Admin extends User` | Class hierarchy extending reusable identity state and behavioral attributes. |
| **OOP** | **Polymorphism** | `Student` implementing `Gradable`, dynamic dispatch on `getRoleTitle()` and `calculateGrade()` | Runtime method dispatch depending on concrete entity role (`STUDENT` vs `ADMIN`). |
| **JDBC** | **PreparedStatement & Injection Defense** | `UserDAO.java`, `QuizDAO.java`, `QuestionDAO.java` | Parameterized SQL queries to eliminate SQL injection vulnerabilities. |
| **JDBC** | **ACID Transactions** | `AttemptDAO.java` (`conn.setAutoCommit(false)`, `commit()`, `rollback()`) | Ensures master attempt record and all child question responses commit atomically or roll back completely. |
| **JDBC** | **Batch Operations & AutoCloseable** | `AttemptDAO.java`, `DBConnection.java` | `addBatch()` / `executeBatch()` for fast bulk child answer inserts; `try-with-resources` resource cleanup. |
| **Collections** | **List, Map, Set, Sorting** | `QuizService.java`, `GradingExecutionService.java` | `List<Quiz>`, `Map<String, Integer>` for submission scoring, and `Comparator` sorting for class leaderboards. |
| **Generics** | **Generic Result Wrapper** | `com.quiznova.util.Result<T>` | Compile-time type safety for service responses (`Result<List<Quiz>>`, `Result<Attempt>`). |
| **Multithreading** | **ExecutorService & Thread Pools** | `GradingExecutionService.java` | Background worker thread pool asynchronously evaluating complex submissions without blocking HTTP threads. |
| **Multithreading** | **Concurrency & Synchronization** | `GradingExecutionService.java` (`synchronized (leaderboardLock)`, `ConcurrentHashMap`) | Thread-safe critical sections protecting in-memory leaderboard cache and atomic submission counters. |
| **Servlets** | **Jakarta Servlet 6.0 (`@WebServlet`)** | `RegisterServlet`, `LoginServlet`, `QuizListServlet`, `SubmitQuizServlet`, `ResultServlet`, `AdminQuizServlet` | REST-like JSON API handling HTTP `GET`, `POST`, `PUT`, `DELETE`. |
| **Servlets** | **Session Tracking (HttpSession)** | `AuthFilter.java`, `LoginServlet.java`, `LogoutServlet.java` | `JSESSIONID` cookie session state for user authentication and role verification (`ADMIN` vs `STUDENT`). |

---

## 2. Project Directory Structure

```text
backend/
├── pom.xml                                  <-- Maven build descriptor (Java 17, Jakarta 6, MySQL, HikariCP)
├── README.md                                <-- Complete setup, concept matrix & execution guide
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── quiznova/
        │           ├── dao/                 <-- JDBC DAO layer (PreparedStatement & transactions)
        │           │   ├── AttemptDAO.java
        │           │   ├── QuestionDAO.java
        │           │   ├── QuizDAO.java
        │           │   └── UserDAO.java
        │           ├── exception/           <-- Custom domain exception hierarchy
        │           │   ├── AuthenticationException.java
        │           │   ├── InvalidQuizException.java
        │           │   ├── QuizNotFoundException.java
        │           │   └── QuizNovaException.java
        │           ├── filter/              <-- Jakarta Web Filter (CORS, character encoding, auth check)
        │           │   └── AuthFilter.java
        │           ├── model/               <-- OOP Domain Models (Person, Gradable, Student, Admin...)
        │           │   ├── Admin.java
        │           │   ├── Attempt.java
        │           │   ├── AttemptAnswer.java
        │           │   ├── Gradable.java
        │           │   ├── Person.java
        │           │   ├── Question.java
        │           │   ├── Quiz.java
        │           │   ├── QuizDifficulty.java
        │           │   ├── Student.java
        │           │   ├── User.java
        │           │   └── UserRole.java
        │           ├── service/             <-- Service Layer (Collections, Generics & Multithreading)
        │           │   ├── AuthService.java
        │           │   ├── GradingExecutionService.java
        │           │   └── QuizService.java
        │           ├── servlet/             <-- Jakarta EE HTTP Servlets returning JSON
        │           │   ├── AdminQuizServlet.java
        │           │   ├── LoginServlet.java
        │           │   ├── LogoutServlet.java
        │           │   ├── QuizListServlet.java
        │           │   ├── RegisterServlet.java
        │           │   └── SubmitQuizServlet.java
        │           └── util/                <-- Utility helpers
        │               ├── DBConnection.java
        │               ├── JsonUtil.java
        │               └── Result.java
        ├── resources/
        │   ├── db.properties                <-- Externalized MySQL credentials & HikariCP configuration
        │   └── schema.sql                   <-- MySQL relational schema DDL and initial sample seeds
        └── webapp/
            └── WEB-INF/
                └── web.xml                  <-- Jakarta EE 10 / Servlet 6.0 deployment descriptor
```

---

## 3. Prerequisites & System Requirements

- **Java Development Kit (JDK)**: OpenJDK 17 or Oracle JDK 17 (or newer)
- **Database**: MySQL 8.0 or MariaDB 10.5+
- **Servlet Container / Application Server**: Apache Tomcat 10.1+ (Note: Tomcat 9 uses `javax.servlet`; Tomcat 10+ uses `jakarta.servlet`)
- **Build Tool**: Apache Maven 3.8+

Verify installations:
```bash
java -version
mvn -version
mysql --version
```

---

## 4. Database Setup (MySQL)

1. Connect to your local MySQL server:
```bash
mysql -u root -p
```

2. Execute the provided `schema.sql` script located in `backend/src/main/resources/schema.sql`:
```sql
SOURCE /path/to/quiznova/backend/src/main/resources/schema.sql;
```

Or run directly from your terminal:
```bash
mysql -u root -p < backend/src/main/resources/schema.sql
```

3. Update `backend/src/main/resources/db.properties` with your database credentials:
```properties
db.driver=com.mysql.cj.jdbc.Driver
db.url=jdbc:mysql://localhost:3306/quiznova_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
db.username=root
db.password=YOUR_MYSQL_PASSWORD

pool.maximumPoolSize=10
pool.minimumIdle=2
```

---

## 5. Build & Packaging

Navigate to the `backend/` directory containing `pom.xml`:

```bash
cd backend
mvn clean package
```

Upon successful compilation, Maven produces the deployable web archive:
```text
target/quiznova.war
```

---

## 6. Deployment to Apache Tomcat 10+

### Option A: Standard Deployment (Tomcat GUI or webapps directory)
1. Copy `target/quiznova.war` into your Tomcat `webapps/` folder:
   ```bash
   cp target/quiznova.war $CATALINA_HOME/webapps/
   ```
2. Start Tomcat:
   - **Linux/macOS**: `$CATALINA_HOME/bin/startup.sh`
   - **Windows**: `%CATALINA_HOME%\bin\startup.bat`
3. Tomcat will unpack `quiznova.war` and deploy the application at:
   `http://localhost:8080/quiznova/`

### Option B: Embedded Maven Cargo / Tomcat Plugin
You can also run directly with the cargo plugin:
```bash
mvn cargo:run
```

---

## 7. REST API Endpoints Specification

### Authentication (`/api/auth/*`)
- **`POST /api/auth/login`**: Authenticates user and sets session.
  ```json
  // Request
  { "email": "alex@example.com", "password": "student123" }
  // Response (200 OK)
  { "success": true, "data": { "id": "u_student_01", "name": "Alex Mercer", "role": "STUDENT" } }
  ```
- **`POST /api/auth/register`**: Creates new student or admin.
- **`POST /api/auth/logout`**: Invalidates server `HttpSession`.

### Quizzes (`/api/quizzes/*`)
- **`GET /api/quizzes`**: Returns full catalog of quizzes with question counts and categories.
- **`GET /api/quizzes/{id}`**: Returns quiz metadata and all questions for test execution.
- **`POST /api/quizzes/submit`**: Submits user answers for multithreaded auto-grading.
  ```json
  // Request
  {
    "quizId": "quiz_core_java",
    "answers": {
      "q_cj_1": 2,
      "q_cj_2": 1,
      "q_cj_3": 1,
      "q_cj_4": 1
    },
    "timeTakenSeconds": 245
  }
  ```

### Performance & Results (`/api/results/*`)
- **`GET /api/results`**: Returns historical attempts (filtered by user session or all for admin).
- **`GET /api/results/{id}`**: Returns single attempt with individual question correctness.
- **`GET /api/results/leaderboard`**: Returns synchronized class ranking cache.

### Instructor Admin (`/api/admin/quizzes/*`)
*(Requires session with `role: "ADMIN"`)*
- **`POST /api/admin/quizzes`**: Create a new quiz topic.
- **`PUT /api/admin/quizzes/{id}`**: Update existing quiz attributes.
- **`DELETE /api/admin/quizzes/{id}`**: Delete quiz and cascade delete questions.

---

## 8. Default Seed Credentials

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Instructor Admin** | Admin Instructor | `admin@quiznova.com` | `admin123` |
| **Student** | Alex Mercer | `alex@example.com` | `student123` |
| **Student** | Priya Sharma | `priya@example.com` | `student123` |

import { Quiz, Question, User, Attempt } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_admin_01',
    name: 'Admin Instructor',
    email: 'admin@quiznova.com',
    password: 'admin123',
    role: 'admin',
    joinedAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user_student_01',
    name: 'Alex Mercer',
    email: 'alex@example.com',
    password: 'student123',
    role: 'student',
    joinedAt: '2026-02-01T10:15:00Z',
  },
  {
    id: 'user_student_02',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'student123',
    role: 'student',
    joinedAt: '2026-02-05T14:30:00Z',
  },
  {
    id: 'user_student_03',
    name: 'Jordan Vance',
    email: 'jordan@example.com',
    password: 'student123',
    role: 'student',
    joinedAt: '2026-02-12T09:45:00Z',
  },
  {
    id: 'user_student_04',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    password: 'student123',
    role: 'student',
    joinedAt: '2026-02-18T16:20:00Z',
  },
  {
    id: 'user_student_05',
    name: 'David Kim',
    email: 'david@example.com',
    password: 'student123',
    role: 'student',
    joinedAt: '2026-02-22T11:00:00Z',
  },
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz_core_java',
    title: 'Core Java Fundamentals & JVM Memory',
    description: 'Master primitive types, memory areas (Heap vs Stack), Garbage Collection, immutability, and JVM execution internals.',
    category: 'Core Java',
    difficulty: 'Beginner',
    durationMinutes: 12,
    passPercentage: 70,
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-02-01T09:00:00Z',
  },
  {
    id: 'quiz_oop_java',
    title: 'Object-Oriented Programming in Java',
    description: 'Deep dive into Polymorphism, Inheritance, Encapsulation, Abstract classes vs Interfaces, and modern Record classes.',
    category: 'OOP Concepts',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    passPercentage: 75,
    createdAt: '2026-02-02T10:00:00Z',
    updatedAt: '2026-02-02T10:00:00Z',
  },
  {
    id: 'quiz_collections',
    title: 'Java Collections Framework & Generics',
    description: 'Test your understanding of List, Set, Map structures, hashing collisions, TreeSet ordering, and thread-safe collections.',
    category: 'Collections Framework',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    passPercentage: 75,
    createdAt: '2026-02-03T11:00:00Z',
    updatedAt: '2026-02-03T11:00:00Z',
  },
  {
    id: 'quiz_jdbc',
    title: 'JDBC & Database Persistence',
    description: 'Relational data access with JDBC: DriverManager, Connection pooling, PreparedStatement, SQL injection defense, and transactions.',
    category: 'JDBC',
    difficulty: 'Advanced',
    durationMinutes: 12,
    passPercentage: 70,
    createdAt: '2026-02-04T13:00:00Z',
    updatedAt: '2026-02-04T13:00:00Z',
  },
  {
    id: 'quiz_servlets',
    title: 'Java Servlets & Enterprise Web Architecture',
    description: 'HTTP request handling, Servlet lifecycle methods, Session management, Filters, and Dispatcher mechanics in standard Java EE / Jakarta EE.',
    category: 'Servlets & JSP',
    difficulty: 'Advanced',
    durationMinutes: 15,
    passPercentage: 70,
    createdAt: '2026-02-05T15:00:00Z',
    updatedAt: '2026-02-05T15:00:00Z',
  },
];

export const INITIAL_QUESTIONS: Question[] = [
  // --- Quiz 1: Core Java (8 questions) ---
  {
    id: 'q_cj_1',
    quizId: 'quiz_core_java',
    questionText: 'Where are local primitive variables and object references stored in the JVM memory architecture?',
    options: [
      'In the Metaspace',
      'In the Heap memory',
      'In the JVM Stack frame for the calling thread',
      'In the Constant Pool'
    ],
    correctOptionIndex: 2,
    explanation: 'Local variables and references inside a method execution are allocated within the thread-specific JVM Stack frame. Only the actual object instances themselves reside on the Heap.',
    marks: 1,
  },
  {
    id: 'q_cj_2',
    quizId: 'quiz_core_java',
    questionText: 'What is the output of the following Java snippet regarding String immutability and the String Constant Pool?',
    codeSnippet: `String s1 = "QuizNova";
String s2 = new String("QuizNova");
System.out.println((s1 == s2) + " " + s1.equals(s2));`,
    options: [
      'true true',
      'false true',
      'true false',
      'false false'
    ],
    correctOptionIndex: 1,
    explanation: 'The `==` operator compares memory references. `s1` refers to the String Constant Pool literal while `new String(...)` forces allocation of a distinct object on the Heap, so `s1 == s2` is false. The `.equals()` method compares character content, returning true.',
    marks: 1,
  },
  {
    id: 'q_cj_3',
    quizId: 'quiz_core_java',
    questionText: 'What happens when a static method attempts to directly invoke an instance method of the same class without an object instance?',
    options: [
      'It compiles cleanly and runs using default constructor',
      'A compile-time error occurs: non-static method cannot be referenced from a static context',
      'It throws a NullPointerException at runtime',
      'The JVM automatically promotes the instance method to static'
    ],
    correctOptionIndex: 1,
    explanation: 'Static methods belong to the class definition rather than any object instance and do not possess a `this` reference. Accessing instance members without an instantiated object causes a compile-time error.',
    marks: 1,
  },
  {
    id: 'q_cj_4',
    quizId: 'quiz_core_java',
    questionText: 'Which primitive data type in Java has a size of exactly 16 bits and is signed (two\'s complement)?',
    options: [
      'char',
      'short',
      'byte',
      'int'
    ],
    correctOptionIndex: 1,
    explanation: '`short` is a 16-bit signed two\'s complement integer (range -32,768 to 32,767). Note that `char` is also 16-bit, but it is unsigned (0 to 65,535).',
    marks: 1,
  },
  {
    id: 'q_cj_5',
    quizId: 'quiz_core_java',
    questionText: 'What will be printed when executing the following try-catch-finally block?',
    codeSnippet: `public static int test() {
    try {
        return 10;
    } finally {
        return 20;
    }
}`,
    options: [
      '10',
      '20',
      'Compilation error due to unreachable statement',
      'Runtime exception: AmbiguousReturnException'
    ],
    correctOptionIndex: 1,
    explanation: 'The `finally` block always executes before control exits the method. A return statement in a `finally` block will override any prior return statement in the `try` or `catch` blocks.',
    marks: 1,
  },
  {
    id: 'q_cj_6',
    quizId: 'quiz_core_java',
    questionText: 'How does Java Garbage Collection determine if an object on the heap is eligible for collection?',
    options: [
      'When its reference count strictly drops to zero',
      'When the object is unreachable from any GC Roots via reference chain traversal',
      'When the finalize() method completes execution',
      'When the thread that allocated the object terminates'
    ],
    correctOptionIndex: 1,
    explanation: 'Modern JVMs use tracing garbage collectors starting from GC Roots (thread stack frames, static variables, JNI references). If an object cannot be reached via any live reference path, it is eligible for reclamation, avoiding circular reference leaks.',
    marks: 1,
  },
  {
    id: 'q_cj_7',
    quizId: 'quiz_core_java',
    questionText: 'What is the default initial capacity and load factor of a standard Java StringBuilder?',
    options: [
      '10 characters, load factor 0.75',
      '16 characters, expands by (oldCapacity * 2) + 2',
      '32 characters, expands strictly by double',
      'Zero characters until first append'
    ],
    correctOptionIndex: 1,
    explanation: '`new StringBuilder()` initializes an internal char (or byte in Java 9+) array of capacity 16. When capacity is exceeded, it grows according to `(oldCapacity * 2) + 2`.',
    marks: 1,
  },
  {
    id: 'q_cj_8',
    quizId: 'quiz_core_java',
    questionText: 'Which of the following statements about Java checked versus unchecked exceptions is correct?',
    options: [
      'Subclasses of RuntimeException and Error are checked exceptions',
      'Checked exceptions must be either caught or declared in the method\'s throws clause',
      'NullPointerException is a checked exception',
      'Checked exceptions are ignored by the javac compiler'
    ],
    correctOptionIndex: 1,
    explanation: 'Checked exceptions (subclasses of Throwable excluding RuntimeException and Error) are verified at compile time. The developer must handle them via try-catch or declare them using `throws`.',
    marks: 1,
  },

  // --- Quiz 2: OOP in Java (8 questions) ---
  {
    id: 'q_oop_1',
    quizId: 'quiz_oop_java',
    questionText: 'Consider dynamic method dispatch in the following polymorphism example. What is the output?',
    codeSnippet: `class SuperClass {
    void print() { System.out.print("Super "); }
}
class SubClass extends SuperClass {
    void print() { System.out.print("Sub "); }
}
public class Test {
    public static void main(String[] args) {
        SuperClass obj = new SubClass();
        obj.print();
    }
}`,
    options: [
      'Super ',
      'Sub ',
      'Super Sub ',
      'Compilation fails'
    ],
    correctOptionIndex: 1,
    explanation: 'In Java, instance method calls are resolved at runtime based on the actual object instance (`SubClass`), not the reference variable type (`SuperClass`). This is known as runtime polymorphism or dynamic method dispatch.',
    marks: 1,
  },
  {
    id: 'q_oop_2',
    quizId: 'quiz_oop_java',
    questionText: 'Which keyword prevents a class from being inherited and prevents a method from being overridden?',
    options: [
      'static',
      'abstract',
      'final',
      'strictfp'
    ],
    correctOptionIndex: 2,
    explanation: 'A `final` class cannot be extended by any subclass, and a `final` method cannot be overridden in derived classes.',
    marks: 1,
  },
  {
    id: 'q_oop_3',
    quizId: 'quiz_oop_java',
    questionText: 'What is true regarding default methods in Java interfaces introduced since Java 8?',
    options: [
      'They cannot have an implementation body',
      'They provide a backward-compatible way to add methods with bodies to interfaces using the default keyword',
      'They can only access private static fields',
      'A class implementing the interface cannot override a default method'
    ],
    correctOptionIndex: 1,
    explanation: 'Default methods permit interface evolution without breaking existing implementing classes by providing a default concrete implementation inside the interface.',
    marks: 1,
  },
  {
    id: 'q_oop_4',
    quizId: 'quiz_oop_java',
    questionText: 'In Java constructor chaining, which rule must be followed when invoking `super()` or `this()`?',
    options: [
      'They must appear as the very first executable statement in the constructor',
      'Both super() and this() can be called sequentially in the same constructor',
      'They can only be called from inside an instance initializer block',
      'super() is forbidden if the class implements any interface'
    ],
    correctOptionIndex: 0,
    explanation: 'In Java, an explicit constructor invocation (`super()` or `this()`) must appear as the first statement in the constructor body. Also, a single constructor cannot call both `super()` and `this()`.',
    marks: 1,
  },
  {
    id: 'q_oop_5',
    quizId: 'quiz_oop_java',
    questionText: 'What distinguishes Java Record classes (introduced in Java 14/16) from traditional POJO classes?',
    options: [
      'Records are mutable data carriers by default',
      'Records automatically synthesize private final fields, canonical constructor, equals(), hashCode(), and toString()',
      'Records can extend any abstract class',
      'Records cannot implement any interfaces'
    ],
    correctOptionIndex: 1,
    explanation: 'Records are immutable transparent carriers for shallowly immutable data. The compiler generates standard accessors, canonical constructor, `equals()`, `hashCode()`, and `toString()`.',
    marks: 1,
  },
  {
    id: 'q_oop_6',
    quizId: 'quiz_oop_java',
    questionText: 'Which OOP principle is violated when an internal mutable collection is returned directly from a getter method without a defensive copy?',
    options: [
      'Polymorphism',
      'Encapsulation',
      'Abstraction',
      'Multiple Inheritance'
    ],
    correctOptionIndex: 1,
    explanation: 'Returning direct references to mutable internal state breaks encapsulation because outside callers can alter the object\'s internal fields without going through its methods.',
    marks: 1,
  },
  {
    id: 'q_oop_7',
    quizId: 'quiz_oop_java',
    questionText: 'Can an abstract class in Java have concrete methods and a constructor?',
    options: [
      'No, abstract classes can only contain abstract method signatures',
      'Yes, an abstract class can have constructors and both concrete and abstract methods',
      'It can have concrete methods, but no constructors',
      'It can have constructors, but no state variables'
    ],
    correctOptionIndex: 1,
    explanation: 'Abstract classes can possess constructors (invoked via `super()` by subclasses), instance state, and full concrete methods alongside abstract method signatures.',
    marks: 1,
  },
  {
    id: 'q_oop_8',
    quizId: 'quiz_oop_java',
    questionText: 'What happens during method overloading versus method overriding?',
    options: [
      'Overloading requires identical parameters; overriding requires different parameters',
      'Overloading is resolved at compile-time by method signature; overriding is resolved at runtime based on the actual object instance',
      'Overloading requires inheritance; overriding does not',
      'Both are resolved strictly at runtime in the JVM'
    ],
    correctOptionIndex: 1,
    explanation: 'Overloading (same method name, different parameter types/counts) is static polymorphism resolved by compiler. Overriding (subclass redefining parent method) is dynamic polymorphism resolved at runtime.',
    marks: 1,
  },

  // --- Quiz 3: Java Collections Framework (8 questions) ---
  {
    id: 'q_col_1',
    quizId: 'quiz_collections',
    questionText: 'What is the worst-case time complexity of retrieving an element by key from a standard java.util.HashMap in Java 8+ when all keys collide into the same bucket?',
    options: [
      'O(1)',
      'O(N)',
      'O(log N)',
      'O(N log N)'
    ],
    correctOptionIndex: 2,
    explanation: 'In Java 8+, when a hash bucket exceeds TREEIFY_THRESHOLD (8 entries) and the total table capacity reaches at least 64, the linked list bucket converts into a balanced Red-Black Tree, yielding O(log N) worst-case lookup time.',
    marks: 1,
  },
  {
    id: 'q_col_2',
    quizId: 'quiz_collections',
    questionText: 'Which collection guarantees elements remain sorted according to their natural ordering or a supplied Comparator?',
    options: [
      'HashSet',
      'LinkedHashSet',
      'TreeSet',
      'ArrayDeque'
    ],
    correctOptionIndex: 2,
    explanation: '`TreeSet` is backed by a `NavigableMap` (specifically `TreeMap`), maintaining elements in ascending sorted order according to their natural ordering (`Comparable`) or a customized `Comparator`.',
    marks: 1,
  },
  {
    id: 'q_col_3',
    quizId: 'quiz_collections',
    questionText: 'What exception is thrown when a collection is structurally modified while being iterated over using a fail-fast iterator?',
    options: [
      'IllegalStateException',
      'ConcurrentModificationException',
      'IndexOutOfBoundsException',
      'NoSuchElementException'
    ],
    correctOptionIndex: 1,
    explanation: 'Fail-fast iterators detect unexpected structural mutations by checking `modCount`. If the count changes outside of the iterator\'s own `remove()` method, a `ConcurrentModificationException` is immediately thrown.',
    marks: 1,
  },
  {
    id: 'q_col_4',
    quizId: 'quiz_collections',
    questionText: 'How does ArrayList compare to LinkedList when randomly accessing an element by index at `list.get(50000)`?',
    options: [
      'LinkedList is faster because pointers avoid array bound checks',
      'ArrayList is O(1) via direct array memory index arithmetic, while LinkedList is O(N) traversing nodes',
      'Both are O(1) in Java 17+',
      'ArrayList is O(log N) due to dynamic growth'
    ],
    correctOptionIndex: 1,
    explanation: '`ArrayList` stores elements in a contiguous memory array (`elementData[index]`), which allows direct O(1) index access. `LinkedList` is a doubly linked list requiring pointer traversal from the head or tail, running in O(N) time.',
    marks: 1,
  },
  {
    id: 'q_col_5',
    quizId: 'quiz_collections',
    questionText: 'Which contract must be maintained between `equals()` and `hashCode()` in Java objects used as HashMap keys?',
    options: [
      'If two objects have the same hashCode, their equals() must return true',
      'If two objects are equal according to equals(), their hashCode() values must be identical',
      'hashCode() must return a distinct integer for every distinct memory address',
      'equals() can only compare primitive integer attributes'
    ],
    correctOptionIndex: 1,
    explanation: 'The Java Object contract specifies: If `objA.equals(objB)` is true, then `objA.hashCode() == objB.hashCode()` must be true. Violating this will cause a HashMap or HashSet to fail to locate stored entries.',
    marks: 1,
  },
  {
    id: 'q_col_6',
    quizId: 'quiz_collections',
    questionText: 'How does ConcurrentHashMap achieve thread safety without synchronizing the entire map like Hashtable does?',
    options: [
      'It creates an immutable copy of the entire map on every write operation',
      'It uses bucket-level synchronization (CAS and synchronized on bucket head nodes)',
      'It restricts reading and writing to a single dedicated daemon thread',
      'It utilizes reentrant locks across every single key lookup'
    ],
    correctOptionIndex: 1,
    explanation: 'In Java 8+, `ConcurrentHashMap` uses non-blocking Compare-And-Swap (CAS) for empty bucket insertions and synchronized locks strictly on the individual head node of the target bucket, allowing high parallel read/write throughput.',
    marks: 1,
  },
  {
    id: 'q_col_7',
    quizId: 'quiz_collections',
    questionText: 'What is the characteristic of LinkedHashMap compared to standard HashMap?',
    options: [
      'It consumes less memory than HashMap',
      'It maintains a doubly linked list through all entries, preserving insertion order or access order',
      'It sorts entries in alphabetical order automatically',
      'It disallows null keys and null values'
    ],
    correctOptionIndex: 1,
    explanation: '`LinkedHashMap` maintains a doubly linked list running through all of its entries. This defines the iteration order, which is normally the order in which keys were inserted into the map (or access-ordered for LRU caches).',
    marks: 1,
  },
  {
    id: 'q_col_8',
    quizId: 'quiz_collections',
    questionText: 'What is the effect of calling `Collections.unmodifiableList(originalList)` in Java?',
    options: [
      'It makes a deep clone of originalList that can never be modified',
      'It returns an unmodifiable view; attempts to mutate it throw UnsupportedOperationException, but changes to originalList still reflect',
      'It locks originalList so nobody can modify originalList directly',
      'It freezes the JVM thread'
    ],
    correctOptionIndex: 1,
    explanation: '`Collections.unmodifiableList()` creates an unmodifiable wrapper view. Any modification attempted on the view throws `UnsupportedOperationException`, but if the underlying backing list is modified elsewhere, the view will reflect those updates.',
    marks: 1,
  },

  // --- Quiz 4: JDBC (8 questions) ---
  {
    id: 'q_jdbc_1',
    quizId: 'quiz_jdbc',
    questionText: 'Why is `PreparedStatement` strongly favored over standard `Statement` for parameterized SQL queries in Java?',
    options: [
      'It automatically converts relational tables into NoSQL documents',
      'It precompiles the SQL query template on the database server and protects against SQL Injection',
      'It removes the requirement for database connection credentials',
      'It eliminates the need for closing database connections'
    ],
    correctOptionIndex: 1,
    explanation: '`PreparedStatement` allows the DB engine to compile and cache the SQL execution plan. Parameters passed via `setXxx()` are treated strictly as data rather than executable SQL code, preventing SQL injection.',
    marks: 1,
  },
  {
    id: 'q_jdbc_2',
    quizId: 'quiz_jdbc',
    questionText: 'How do you programmatically manage atomic database transactions across multiple JDBC operations?',
    options: [
      'Set `connection.setAutoCommit(false)` then call `connection.commit()` or `connection.rollback()` in a catch block',
      'Invoke `Statement.execute("BEGIN TRANSACTION")` manually',
      'Annotate the Java method with `@Transactional` without any JDBC configuration',
      'Close and reopen the connection after every single INSERT statement'
    ],
    correctOptionIndex: 0,
    explanation: 'By default, JDBC connections have auto-commit set to true. To create an atomic multi-step transaction, disable auto-commit with `connection.setAutoCommit(false)`, perform queries, call `connection.commit()`, and roll back in the catch block if an error occurs.',
    marks: 1,
  },
  {
    id: 'q_jdbc_3',
    quizId: 'quiz_jdbc',
    questionText: 'What is the correct way to handle JDBC resources like `Connection`, `PreparedStatement`, and `ResultSet` to avoid resource leaks?',
    options: [
      'Rely on Java Garbage Collection to close sockets automatically',
      'Use the try-with-resources statement because they implement `java.lang.AutoCloseable`',
      'Keep a single global static Connection open for the entire lifetime of the application',
      'Call System.gc() immediately after fetching results'
    ],
    correctOptionIndex: 1,
    explanation: 'JDBC resources (`Connection`, `Statement`, `ResultSet`) hold native OS socket and DB cursor handles. Because they implement `AutoCloseable`, using `try (Connection conn = ...; PreparedStatement ps = ...) { ... }` guarantees they are closed reliably even on exception.',
    marks: 1,
  },
  {
    id: 'q_jdbc_4',
    quizId: 'quiz_jdbc',
    questionText: 'What does the method `resultSet.next()` return when the cursor advances past the final row of the result set?',
    options: [
      'null',
      'false',
      'true',
      'SQLException with error code SQL_END_OF_DATA'
    ],
    correctOptionIndex: 1,
    explanation: '`resultSet.next()` moves the cursor forward one row from its current position. It returns `true` if the new current row is valid, and `false` when there are no more rows.',
    marks: 1,
  },
  {
    id: 'q_jdbc_5',
    quizId: 'quiz_jdbc',
    questionText: 'What is the primary role of a connection pooling library like HikariCP or Apache Commons DBCP in a Java application?',
    options: [
      'To serialize Java objects directly to disk',
      'To maintain a pool of pre-established database connections to avoid TCP and handshake overhead on every request',
      'To replace the SQL query engine with an in-memory cache',
      'To encrypt all database tables on the hard drive'
    ],
    correctOptionIndex: 1,
    explanation: 'Establishing a new physical database connection involves TCP three-way handshake, TLS negotiation, authentication, and backend process creation. A pool pre-allocates connections and loans them to threads, improving latency and throughput by orders of magnitude.',
    marks: 1,
  },
  {
    id: 'q_jdbc_6',
    quizId: 'quiz_jdbc',
    questionText: 'Which JDBC method is executed to run an `UPDATE` or `DELETE` SQL statement and what does it return?',
    options: [
      '`executeQuery()`, returns a ResultSet',
      '`executeUpdate()`, returns an int representing the number of rows affected',
      '`executeBatch()`, returns a boolean true if successful',
      '`executeModify()`, returns void'
    ],
    correctOptionIndex: 1,
    explanation: '`executeUpdate()` is used for DML statements (INSERT, UPDATE, DELETE) or DDL statements. It returns an integer indicating the count of rows impacted in the database.',
    marks: 1,
  },
  {
    id: 'q_jdbc_7',
    quizId: 'quiz_jdbc',
    questionText: 'In a JDBC ResultSet with standard forward-only cursor, how do you read column values from a table row?',
    options: [
      'By using getter methods like `getString()`, `getInt()` with 1-based column indices or column name strings',
      'By accessing public array indices like `resultSet[0]`',
      'By deserializing the row through ObjectInputStream',
      'By invoking `getZeroBasedColumn(0)`'
    ],
    correctOptionIndex: 0,
    explanation: 'JDBC specifies 1-based indexing for column numbers in `ResultSet.getXXX(int columnIndex)` and also supports column labels via `ResultSet.getXXX(String columnLabel)`.',
    marks: 1,
  },
  {
    id: 'q_jdbc_8',
    quizId: 'quiz_jdbc',
    questionText: 'What does the JDBC `DatabaseMetaData` interface provide?',
    options: [
      'Metrics about the client computer\'s CPU and RAM',
      'Comprehensive information regarding the database product, capabilities, supported SQL features, tables, and driver version',
      'A list of active user HTTP sessions',
      'The source code of stored procedures only'
    ],
    correctOptionIndex: 1,
    explanation: '`connection.getMetaData()` returns a `DatabaseMetaData` instance providing comprehensive information about the database as a whole: table catalogs, data types supported, max connections, transaction isolation levels, and driver capabilities.',
    marks: 1,
  },

  // --- Quiz 5: Servlets & JSP (8 questions) ---
  {
    id: 'q_srv_1',
    quizId: 'quiz_servlets',
    questionText: 'What is the correct sequence of lifecycle methods invoked on a Java Servlet by the Servlet Container?',
    options: [
      'init() -> service() [repeated per request] -> destroy()',
      'service() -> init() -> destroy()',
      'constructor -> doGet() -> destroy() -> init()',
      'load() -> execute() -> unload()'
    ],
    correctOptionIndex: 0,
    explanation: 'The container loads the servlet class, instantiates it, calls `init()` once. For each incoming client request, the container spawns or assigns a worker thread to call `service()` (which routes to `doGet`, `doPost`, etc.). Finally, on shutdown or reload, `destroy()` is called once.',
    marks: 1,
  },
  {
    id: 'q_srv_2',
    quizId: 'quiz_servlets',
    questionText: 'How does `RequestDispatcher.forward()` differ fundamentally from `HttpServletResponse.sendRedirect()`?',
    options: [
      '`forward()` is client-side roundtrip; `sendRedirect()` is server-side internal',
      '`forward()` is server-side internal (URL remains unchanged; request attributes preserved); `sendRedirect()` issues an HTTP 302 response causing the browser to make a new GET request',
      'Both make identical HTTP 301 redirects to the browser',
      '`sendRedirect()` cannot pass parameters to external websites'
    ],
    correctOptionIndex: 1,
    explanation: '`forward()` happens entirely inside the container on the server without client awareness (keeping original URL and request attributes). `sendRedirect()` sends an HTTP 302/303 redirect status to the browser, prompting a separate roundtrip GET request.',
    marks: 1,
  },
  {
    id: 'q_srv_3',
    quizId: 'quiz_servlets',
    questionText: 'How is an `HttpSession` typically tracked across stateless HTTP requests when the client browser permits standard headers?',
    options: [
      'Via IP address binding in the router',
      'Via the JSESSIONID cookie sent by the server in the Set-Cookie response header and returned by the client',
      'By requiring the user to pass their password in every header',
      'By maintaining a permanent raw TCP socket connection'
    ],
    correctOptionIndex: 1,
    explanation: 'The Servlet container generates a unique cryptographic token stored in a cookie called `JSESSIONID`. The browser includes this cookie in subsequent HTTP headers, enabling the server to correlate requests with the user\'s server-side session memory.',
    marks: 1,
  },
  {
    id: 'q_srv_4',
    quizId: 'quiz_servlets',
    questionText: 'Is a standard Java Servlet instance thread-safe by default when handling concurrent HTTP requests?',
    options: [
      'Yes, the servlet container creates a brand new Servlet instance for every request',
      'No, a single Servlet instance is shared across concurrent threads; instance variables are shared and susceptible to race conditions',
      'Yes, Java automatically locks every method in a HttpServlet class',
      'Only if running on Linux OS'
    ],
    correctOptionIndex: 1,
    explanation: 'By default, the servlet container creates only ONE instance of each servlet. Multiple client requests are handled concurrently by different threads calling `service()`. Any instance or static fields are shared, making them non-thread-safe unless synchronized.',
    marks: 1,
  },
  {
    id: 'q_srv_5',
    quizId: 'quiz_servlets',
    questionText: 'Which interface in Java EE / Jakarta EE intercepts HTTP requests before they reach a Servlet to perform authentication, logging, or compression?',
    options: [
      'javax.servlet.Filter (or jakarta.servlet.Filter)',
      'javax.servlet.InterceptorBridge',
      'javax.servlet.HttpProxy',
      'java.lang.reflect.InvocationHandler'
    ],
    correctOptionIndex: 0,
    explanation: 'A `Filter` implements `doFilter(ServletRequest, ServletResponse, FilterChain)` allowing pre-processing of requests and post-processing of responses before and after servlet invocation.',
    marks: 1,
  },
  {
    id: 'q_srv_6',
    quizId: 'quiz_servlets',
    questionText: 'Which scope provides the widest visibility and longest lifespan for sharing attributes across an entire web application?',
    options: [
      'Request Scope (HttpServletRequest)',
      'Session Scope (HttpSession)',
      'Application Scope (ServletContext)',
      'Page Scope (PageContext)'
    ],
    correctOptionIndex: 2,
    explanation: '`ServletContext` (Application scope) exists for the entire lifetime of the web application and is shared by all servlets, filters, and users within that web application.',
    marks: 1,
  },
  {
    id: 'q_srv_7',
    quizId: 'quiz_servlets',
    questionText: 'What modern annotation replaced the need to declare `<servlet>` and `<servlet-mapping>` blocks in web.xml since Servlet 3.0?',
    options: [
      '@WebServlet(urlPatterns = "/api/*")',
      '@Controller',
      '@ServletRoute',
      '@RestMapping'
    ],
    correctOptionIndex: 0,
    explanation: 'Servlet 3.0+ introduced `@WebServlet`, allowing servlets to declare their name, init parameters, and URL mappings directly in the Java source code without requiring entries in `web.xml`.',
    marks: 1,
  },
  {
    id: 'q_srv_8',
    quizId: 'quiz_servlets',
    questionText: 'What HTTP status code is sent when `response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Access Denied")` is invoked?',
    options: [
      '403 Forbidden',
      '401 Unauthorized',
      '404 Not Found',
      '500 Internal Server Error'
    ],
    correctOptionIndex: 1,
    explanation: '`HttpServletResponse.SC_UNAUTHORIZED` corresponds to HTTP status code 401, signifying that authentication credentials are missing or invalid.',
    marks: 1,
  },
];

export const INITIAL_ATTEMPTS: Attempt[] = [
  {
    id: 'att_01',
    userId: 'user_student_02', // Priya
    userName: 'Priya Sharma',
    userEmail: 'priya@example.com',
    quizId: 'quiz_core_java',
    quizTitle: 'Core Java Fundamentals & JVM Memory',
    category: 'Core Java',
    score: 8,
    totalQuestions: 8,
    correctAnswers: 8,
    wrongAnswers: 0,
    skippedAnswers: 0,
    percentage: 100,
    passed: true,
    timeTakenSeconds: 312,
    completedAt: '2026-03-01T14:20:00Z',
    userAnswers: {
      q_cj_1: 2,
      q_cj_2: 1,
      q_cj_3: 1,
      q_cj_4: 1,
      q_cj_5: 1,
      q_cj_6: 1,
      q_cj_7: 1,
      q_cj_8: 1,
    },
  },
  {
    id: 'att_02',
    userId: 'user_student_02', // Priya
    userName: 'Priya Sharma',
    userEmail: 'priya@example.com',
    quizId: 'quiz_oop_java',
    quizTitle: 'Object-Oriented Programming in Java',
    category: 'OOP Concepts',
    score: 7,
    totalQuestions: 8,
    correctAnswers: 7,
    wrongAnswers: 1,
    skippedAnswers: 0,
    percentage: 87.5,
    passed: true,
    timeTakenSeconds: 420,
    completedAt: '2026-03-02T16:00:00Z',
    userAnswers: {
      q_oop_1: 1,
      q_oop_2: 2,
      q_oop_3: 1,
      q_oop_4: 0,
      q_oop_5: 1,
      q_oop_6: 1,
      q_oop_7: 1,
      q_oop_8: 0, // wrong
    },
  },
  {
    id: 'att_03',
    userId: 'user_student_01', // Alex
    userName: 'Alex Mercer',
    userEmail: 'alex@example.com',
    quizId: 'quiz_core_java',
    quizTitle: 'Core Java Fundamentals & JVM Memory',
    category: 'Core Java',
    score: 6,
    totalQuestions: 8,
    correctAnswers: 6,
    wrongAnswers: 2,
    skippedAnswers: 0,
    percentage: 75,
    passed: true,
    timeTakenSeconds: 380,
    completedAt: '2026-03-03T11:10:00Z',
    userAnswers: {
      q_cj_1: 2,
      q_cj_2: 1,
      q_cj_3: 0, // wrong
      q_cj_4: 1,
      q_cj_5: 0, // wrong
      q_cj_6: 1,
      q_cj_7: 1,
      q_cj_8: 1,
    },
  },
  {
    id: 'att_04',
    userId: 'user_student_01', // Alex
    userName: 'Alex Mercer',
    userEmail: 'alex@example.com',
    quizId: 'quiz_collections',
    quizTitle: 'Java Collections Framework & Generics',
    category: 'Collections Framework',
    score: 7,
    totalQuestions: 8,
    correctAnswers: 7,
    wrongAnswers: 1,
    skippedAnswers: 0,
    percentage: 87.5,
    passed: true,
    timeTakenSeconds: 450,
    completedAt: '2026-03-05T09:30:00Z',
    userAnswers: {
      q_col_1: 2,
      q_col_2: 2,
      q_col_3: 1,
      q_col_4: 1,
      q_col_5: 1,
      q_col_6: 1,
      q_col_7: 1,
      q_col_8: 0, // wrong
    },
  },
  {
    id: 'att_05',
    userId: 'user_student_04', // Sarah
    userName: 'Sarah Chen',
    userEmail: 'sarah@example.com',
    quizId: 'quiz_jdbc',
    quizTitle: 'JDBC & Database Persistence',
    category: 'JDBC',
    score: 6,
    totalQuestions: 8,
    correctAnswers: 6,
    wrongAnswers: 2,
    skippedAnswers: 0,
    percentage: 75,
    passed: true,
    timeTakenSeconds: 410,
    completedAt: '2026-03-07T13:45:00Z',
    userAnswers: {
      q_jdbc_1: 1,
      q_jdbc_2: 0,
      q_jdbc_3: 1,
      q_jdbc_4: 1,
      q_jdbc_5: 1,
      q_jdbc_6: 1,
      q_jdbc_7: 1,
      q_jdbc_8: 0, // wrong
    },
  },
  {
    id: 'att_06',
    userId: 'user_student_03', // Jordan
    userName: 'Jordan Vance',
    userEmail: 'jordan@example.com',
    quizId: 'quiz_servlets',
    quizTitle: 'Java Servlets & Enterprise Web Architecture',
    category: 'Servlets & JSP',
    score: 5,
    totalQuestions: 8,
    correctAnswers: 5,
    wrongAnswers: 3,
    skippedAnswers: 0,
    percentage: 62.5,
    passed: false,
    timeTakenSeconds: 520,
    completedAt: '2026-03-08T17:15:00Z',
    userAnswers: {
      q_srv_1: 0,
      q_srv_2: 1,
      q_srv_3: 1,
      q_srv_4: 0, // wrong
      q_srv_5: 0,
      q_srv_6: 1, // wrong
      q_srv_7: 0,
      q_srv_8: 0, // wrong
    },
  },
];

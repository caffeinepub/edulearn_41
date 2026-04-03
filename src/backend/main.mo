import Map "mo:core/Map";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Set "mo:core/Set";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";

actor {
  type CourseId = Nat;
  type LessonId = Nat;
  type QuizId = Nat;

  type Category = {
    #Programming;
    #Design;
    #Business;
    #Science;
  };

  type Difficulty = {
    #Beginner;
    #Intermediate;
    #Advanced;
  };

  type Course = {
    id : CourseId;
    title : Text;
    description : Text;
    category : Category;
    difficulty : Difficulty;
    duration : Nat; // in hours
    lessons : [Lesson];
    quiz : Quiz;
  };

  type Lesson = {
    id : LessonId;
    title : Text;
    content : Text;
  };

  type Question = {
    question : Text;
    options : [Text];
    correctAnswer : Nat;
  };

  type Quiz = {
    id : QuizId;
    questions : [Question];
  };

  type UserProgress = {
    completedLessons : Set.Set<Nat>;
    quizScores : Map.Map<Nat, Nat>;
    learningStreak : Nat;
    lastActiveDay : Time.Time;
    weeklyActivity : Map.Map<Nat, Nat>;
  };

  public type CourseInput = {
    title : Text;
    description : Text;
    category : Category;
    difficulty : Difficulty;
    duration : Nat;
    lessons : [Lesson];
    quiz : Quiz;
  };

  public type LessonInput = {
    title : Text;
    content : Text;
  };

  public type QuizInput = {
    questions : [Question];
  };

  public type UserProgressView = {
    completedLessons : [Nat];
    quizScores : [(Nat, Nat)];
    learningStreak : Nat;
    lastActiveDay : Time.Time;
    weeklyActivity : [(Nat, Nat)];
  };

  var nextCourseId = 6;
  var nextLessonId = 1;
  var nextQuizId = 1;

  let courses = Map.empty<CourseId, Course>();
  let userProgress = Map.empty<Principal, UserProgress>();

  module Course {
    public func compare(course1 : Course, course2 : Course) : Order.Order {
      Int.compare(course1.id, course2.id);
    };
  };

  module Lesson {
    public func compare(lesson1 : Lesson, lesson2 : Lesson) : Order.Order {
      Int.compare(lesson1.id, lesson2.id);
    };
  };

  module Quiz {
    public func compare(quiz1 : Quiz, quiz2 : Quiz) : Order.Order {
      Int.compare(quiz1.id, quiz2.id);
    };
  };

  module Question {
    public func compare(question1 : Question, question2 : Question) : Order.Order {
      Text.compare(question1.question, question2.question);
    };
  };

  module UserProgress {
    public func compare(progress1 : UserProgress, progress2 : UserProgress) : Order.Order {
      Int.compare(progress1.learningStreak, progress2.learningStreak);
    };

    public func compareByStreak(progress1 : UserProgress, progress2 : UserProgress) : Order.Order {
      Int.compare(progress1.learningStreak, progress2.learningStreak);
    };

    public func compareByCompletedLessons(progress1 : UserProgress, progress2 : UserProgress) : Order.Order {
      Int.compare(progress1.completedLessons.size(), progress2.completedLessons.size());
    };

    func userProgressToView(userProgress : UserProgress) : UserProgressView {
      {
        userProgress with
        completedLessons = userProgress.completedLessons.toArray();
        quizScores = userProgress.quizScores.toArray();
        weeklyActivity = userProgress.weeklyActivity.toArray();
      };
    };
  };

  func getCourseInternal(id : CourseId) : Course {
    switch (courses.get(id)) {
      case (null) { Runtime.trap("course does not exist") };
      case (?course) { course };
    };
  };

  // Seed Courses
  let seedCourses : [(CourseId, Course)] = [
    (
      1,
      {
        id = 1;
        title = "Motoko Programming";
        description = "Learn the basics of Motoko programming language";
        category = #Programming;
        difficulty = #Beginner;
        duration = 10;
        lessons = [
          {
            id = 1;
            title = "Introduction to Motoko";
            content = "Motoko is a programming language for the Internet Computer...";
          },
          {
            id = 2;
            title = "Variables and Types";
            content = "Motoko supports various types like Nat, Text, and Bool...";
          },
          {
            id = 3;
            title = "Functions";
            content = "Functions in Motoko are first-class citizens...";
          },
        ];
        quiz = {
          id = 1;
          questions = [
            {
              question = "What is Motoko?";
              options = ["A programming language", "A database", "A web browser"];
              correctAnswer = 0;
            },
            {
              question = "Which type represents text in Motoko?";
              options = ["Text", "String", "Char"];
              correctAnswer = 0;
            },
          ];
        };
      },
    ),
    (
      2,
      {
        id = 2;
        title = "UI/UX Design Principles";
        description = "Learn the fundamentals of user interface and user experience design";
        category = #Design;
        difficulty = #Intermediate;
        duration = 8;
        lessons = [
          {
            id = 4;
            title = "Introduction to UI Design";
            content = "UI design focuses on the look and feel of a product...";
          },
          {
            id = 5;
            title = "UX Basics";
            content = "User experience is about improving customer satisfaction...";
          },
        ];
        quiz = {
          id = 2;
          questions = [
            {
              question = "What does UI stand for?";
              options = ["User Interface", "Unique Identifier", "Universal Input"];
              correctAnswer = 0;
            },
            {
              question = "What is the main goal of UX design?";
              options = ["Improve satisfaction", "Increase prices", "Reduce costs"];
              correctAnswer = 0;
            },
          ];
        };
      },
    ),
    (
      3,
      {
        id = 3;
        title = "Entrepreneurship 101";
        description = "Learn the basics of starting and running a business";
        category = #Business;
        difficulty = #Beginner;
        duration = 6;
        lessons = [
          {
            id = 6;
            title = "Business Fundamentals";
            content = "Entrepreneurship is the process of starting a business...";
          },
          {
            id = 7;
            title = "Marketing Strategies";
            content = "Effective marketing is crucial for business success...";
          },
        ];
        quiz = {
          id = 3;
          questions = [
            {
              question = "What is entrepreneurship?";
              options = ["Starting a business", "Buying a product", "Hiring employees"];
              correctAnswer = 0;
            },
            {
              question = "What is crucial for business success?";
              options = ["Effective marketing", "High prices", "Low salaries"];
              correctAnswer = 0;
            },
          ];
        };
      },
    ),
    (
      4,
      {
        id = 4;
        title = "Physics Fundamentals";
        description = "Learn the basics of physics";
        category = #Science;
        difficulty = #Beginner;
        duration = 7;
        lessons = [
          {
            id = 8;
            title = "Introduction to Physics";
            content = "Physics is the study of matter and energy...";
          },
          {
            id = 9;
            title = "Laws of Motion";
            content = "Newton's laws of motion are fundamental in physics...";
          },
        ];
        quiz = {
          id = 4;
          questions = [
            {
              question = "What is physics the study of?";
              options = ["Matter and energy", "Plants and animals", "History"];
              correctAnswer = 0;
            },
            {
              question = "Who formulated the laws of motion?";
              options = ["Newton", "Einstein", "Tesla"];
              correctAnswer = 0;
            },
          ];
        };
      },
    ),
    (
      5,
      {
        id = 5;
        title = "Frontend Web Development";
        description = "Learn the basics of building websites";
        category = #Programming;
        difficulty = #Beginner;
        duration = 12;
        lessons = [
          {
            id = 10;
            title = "HTML Basics";
            content = "HTML is the standard markup language for creating web pages...";
          },
          {
            id = 11;
            title = "CSS Fundamentals";
            content = "CSS is used to style and layout web pages...";
          },
        ];
        quiz = {
          id = 5;
          questions = [
            {
              question = "What does HTML stand for?";
              options = ["HyperText Markup Language", "HighText Machine Language", "Hyperlinks and Text Markup Language"];
              correctAnswer = 0;
            },
            {
              question = "What is CSS used for?";
              options = ["Styling web pages", "Creating databases", "Writing scripts"];
              correctAnswer = 0;
            },
          ];
        };
      },
    ),
    (
      6,
      {
        id = 6;
        title = "Data Science with Python";
        description = "Learn data science concepts using Python";
        category = #Science;
        difficulty = #Intermediate;
        duration = 15;
        lessons = [
          {
            id = 12;
            title = "Python Basics";
            content = "Python is a popular programming language for data science...";
          },
          {
            id = 13;
            title = "Data Analysis";
            content = "Data analysis involves inspecting, cleansing, and modeling data...";
          },
        ];
        quiz = {
          id = 6;
          questions = [
            {
              question = "What is Python commonly used for?";
              options = ["Data science", "Mechanical engineering", "Civil engineering"];
              correctAnswer = 0;
            },
            {
              question = "What is data analysis?";
              options = [
                "Inspecting, cleansing, modeling data",
                "Writing novels",
                "Building houses",
              ];
              correctAnswer = 0;
            },
          ];
        };
      },
    ),
  ];

  for ((id, course) in seedCourses.values()) {
    courses.add(id, course);
  };

  public shared ({ caller }) func createCourse(courseInput : CourseInput) : async () {
    let newLessons = courseInput.lessons.map(func(lesson) { { lesson with id = nextLessonId } });
    let newQuiz = { courseInput.quiz with id = nextQuizId };
    let newCourse = {
      courseInput with
      id = nextCourseId;
      lessons = newLessons;
      quiz = newQuiz;
    };
    courses.add(nextCourseId, newCourse);
    nextCourseId += 1;
    nextQuizId += 1;
  };

  public query ({ caller }) func getCourses() : async [Course] {
    courses.values().toArray().sort();
  };

  public query ({ caller }) func getCourse(id : CourseId) : async Course {
    getCourseInternal(id);
  };

  public query ({ caller }) func getLessons(courseId : CourseId) : async [Lesson] {
    getCourseInternal(courseId).lessons.sort();
  };

  public query ({ caller }) func getQuiz(courseId : CourseId) : async Quiz {
    getCourseInternal(courseId).quiz;
  };

  public shared ({ caller }) func markLessonComplete(courseId : CourseId, lessonId : LessonId) : async () {
    let completedSet = switch (userProgress.get(caller)) {
      case (null) {
        let newUserProgress = {
          completedLessons = Set.empty<Nat>();
          quizScores = Map.empty<Nat, Nat>();
          learningStreak = 1;
          lastActiveDay = Time.now();
          weeklyActivity = Map.empty<Nat, Nat>();
        };
        userProgress.add(caller, newUserProgress);
        newUserProgress.completedLessons;
      };
      case (?progress) { progress.completedLessons };
    };
    completedSet.add(lessonId);
  };

  public shared ({ caller }) func submitQuizAnswers(courseId : CourseId, answers : [Nat]) : async Nat {
    let quiz = getCourseInternal(courseId).quiz;
    let score = calculateScore(quiz, answers);
    switch (userProgress.get(caller)) {
      case (null) {
        let newUserProgress = {
          completedLessons = Set.empty<Nat>();
          quizScores = Map.empty<Nat, Nat>();
          learningStreak = 1;
          lastActiveDay = Time.now();
          weeklyActivity = Map.empty<Nat, Nat>();
        };
        userProgress.add(caller, newUserProgress);
      };
      case (?progress) { progress.quizScores.add(courseId, score) };
    };
    score;
  };

  func calculateScore(quiz : Quiz, answers : [Nat]) : Nat {
    let correctAnswers = quiz.questions.map(func(q) { q.correctAnswer });
    type ScoreAndIndex = {
      var score : Nat;
      var index : Nat;
    };
    let scoreAndIndex = {
      var score = 0;
      var index = 0;
    };
    answers.foldLeft<Nat, ScoreAndIndex>(
      scoreAndIndex,
      func(scoreAndIndex, answer) {
        if (scoreAndIndex.index < correctAnswers.size() and answer == correctAnswers[scoreAndIndex.index]) {
          scoreAndIndex.score += 1;
        };
        scoreAndIndex.index += 1;
        scoreAndIndex;
      },
    ).score;
  };

  public query ({ caller }) func getUserProgress(user : Principal) : async UserProgressView {
    switch (userProgress.get(user)) {
      case (null) { Runtime.trap("user does not exist") };
      case (?progress) {
        {
          progress with
          completedLessons = progress.completedLessons.toArray();
          quizScores = progress.quizScores.toArray();
          weeklyActivity = progress.weeklyActivity.toArray();
        };
      };
    };
  };

  public query ({ caller }) func getDailyChallenge() : async Quiz {
    let timestamp = Int.abs(Time.now());
    let courseIds = courses.keys().toArray();
    let randomIndex = timestamp % courseIds.size();
    let courseId = courseIds[randomIndex];
    getCourseInternal(courseId).quiz;
  };
};

// src/data/mockData.js

export const INITIAL_USER = {
  name: "Ömer",
  fullName: "Ömer Asaf Ak",
  handle: "whyasaf",
  university: "De Montfort University Dubai",
  major: "Software Engineering",
  level: "IYZ / Foundation Year",
  semester: "Semester 1",
  academicYear: "2026/2027",
  futureProgram: "3-Year B.Sc. (Hons) Software Engineering",
  gpa: "3.92",
  completedCredits: 18,
  totalCredits: 120
};

export const COURSES = [
  {
    id: "eap101",
    code: "EAP101",
    name: "English for Academic Purposes 1",
    instructor: "Schoer Amber",
    room: "Room 2.05 / 2.02",
    credits: 4,
    color: "#9FFF00",
    schedule: [
      { day: "Monday", time: "10:00 – 13:00", room: "Room 2.05", type: "Lecture", instructor: "Schoer Amber" },
      { day: "Wednesday", time: "12:00 – 15:00", room: "Room 2.02", type: "Seminar", instructor: "Schoer Amber" }
    ],
    overview: "Academic literacy, scholarly discourse synthesis, technical literature analysis, argument structuring, and research paper presentation standards.",
    topics: [
      { week: 1, title: "Scholarly Arguments & Thesis Construction", status: "completed" },
      { week: 2, title: "Academic Source Evaluation & APA 7th", status: "completed" },
      { week: 3, title: "Literature Review Synthesis Strategies", status: "in-progress" },
      { week: 4, title: "Technical Report Formatting & Abstract Writing", status: "upcoming" }
    ],
    stats: {
      notesCount: 0,
      materialsCount: 8,
      assignmentsPending: 1,
      gradeEstimate: "93%"
    }
  },
  {
    id: "ass102",
    code: "ASS102",
    name: "Academic and Study Skills",
    instructor: "Andy Pacino",
    room: "Room 2.02",
    credits: 3,
    color: "#737373",
    schedule: [
      { day: "Tuesday", time: "14:00 – 17:00", room: "Room 2.02", type: "Lecture", instructor: "Andy Pacino" }
    ],
    overview: "Critical thinking methodologies, time management frameworks, effective note-taking systems, exam preparation strategies, and scholarly research ethics.",
    topics: [
      { week: 1, title: "Cornell & Outline Note-Taking Frameworks", status: "completed" },
      { week: 2, title: "Time Blocking & Academic Workload Optimization", status: "completed" },
      { week: 3, title: "Critical Analysis of Academic Arguments", status: "in-progress" },
      { week: 4, title: "Scientific Presentation Skills", status: "upcoming" }
    ],
    stats: {
      notesCount: 0,
      materialsCount: 6,
      assignmentsPending: 1,
      gradeEstimate: "91%"
    }
  },
  {
    id: "mss103",
    code: "MSS103",
    name: "Maths Study Skills",
    instructor: "Jugmohan Janeeshla",
    room: "Room 3.02 / Online",
    credits: 4,
    color: "#8A8A8A",
    schedule: [
      { day: "Wednesday", time: "10:00 – 11:00", room: "Room 3.02", type: "Large Group Teaching", instructor: "Jugmohan Janeeshla" },
      { day: "Thursday", time: "11:00 – 12:00", room: "Online (G01-04)", type: "Online Large Group Teaching", instructor: "Jugmohan Janeeshla" }
    ],
    overview: "Fundamental mathematics for computing, algebraic manipulations, calculus foundation, discrete logic notation, and mathematical problem-solving techniques.",
    topics: [
      { week: 1, title: "Algebraic Functions & Systems of Equations", status: "completed" },
      { week: 2, title: "Introduction to Sets, Logic & Boolean Algebra", status: "completed" },
      { week: 3, title: "Calculus Fundamentals: Limits & Differentiation", status: "in-progress" },
      { week: 4, title: "Matrix Algebra Basics for Computing", status: "upcoming" }
    ],
    stats: {
      notesCount: 0,
      materialsCount: 11,
      assignmentsPending: 0,
      gradeEstimate: "95%"
    }
  },
  {
    id: "esl104",
    code: "ESL104",
    name: "ESL Support (Academic & Study Skills)",
    instructor: "Broodhuys Jochem",
    room: "Room 2.05",
    credits: 2,
    color: "#525252",
    schedule: [
      { day: "Wednesday", time: "15:00 – 16:00", room: "Room 2.05", type: "Support", instructor: "Broodhuys Jochem" }
    ],
    overview: "Specialized language support for non-native English speakers focusing on technical vocabulary, oral presentations, and scholarly editing.",
    topics: [
      { week: 1, title: "Technical Vocabulary Building in Computing", status: "completed" },
      { week: 2, title: "Academic Discussion & Seminar Participation", status: "in-progress" },
      { week: 3, title: "Proofreading & Grammar Precision in Technical Papers", status: "upcoming" }
    ],
    stats: {
      notesCount: 0,
      materialsCount: 4,
      assignmentsPending: 0,
      gradeEstimate: "90%"
    }
  }
];

export const REAL_WEEKLY_SCHEDULE = [
  // MONDAY
  { 
    id: "s1",
    day: "Monday", 
    dayIndex: 1,
    time: "10:00 – 13:00", 
    startTime: "10:00",
    endTime: "13:00",
    courseId: "eap101", 
    name: "English for Academic Purposes 1", 
    room: "2.05", 
    type: "Lecture",
    instructor: "Schoer Amber",
    isFree: false
  },
  {
    id: "s1_free",
    day: "Monday",
    dayIndex: 1,
    time: "13:00 – 18:00",
    startTime: "13:00",
    endTime: "18:00",
    name: "Free Time",
    type: "Free Period",
    isFree: true,
    note: "Rest of day free for personal study & coding"
  },

  // TUESDAY
  {
    id: "s2_free",
    day: "Tuesday",
    dayIndex: 2,
    time: "09:00 – 14:00",
    startTime: "09:00",
    endTime: "14:00",
    name: "Free Time",
    type: "Free Period",
    isFree: true,
    note: "Morning free before afternoon lecture"
  },
  { 
    id: "s2",
    day: "Tuesday", 
    dayIndex: 2,
    time: "14:00 – 17:00", 
    startTime: "14:00",
    endTime: "17:00",
    courseId: "ass102", 
    name: "Academic and Study Skills", 
    room: "2.02", 
    type: "Lecture",
    instructor: "Andy Pacino",
    isFree: false
  },

  // WEDNESDAY
  { 
    id: "s3_1",
    day: "Wednesday", 
    dayIndex: 3,
    time: "10:00 – 11:00", 
    startTime: "10:00",
    endTime: "11:00",
    courseId: "mss103", 
    name: "Maths Study Skills", 
    room: "3.02", 
    type: "Large Group Teaching",
    instructor: "Jugmohan Janeeshla",
    isFree: false
  },
  {
    id: "s3_gap",
    day: "Wednesday",
    dayIndex: 3,
    time: "11:00 – 12:00",
    startTime: "11:00",
    endTime: "12:00",
    name: "Free Time",
    type: "Free Period",
    isFree: true,
    note: "1-hour break between Maths and EAP1"
  },
  { 
    id: "s3_2",
    day: "Wednesday", 
    dayIndex: 3,
    time: "12:00 – 15:00", 
    startTime: "12:00",
    endTime: "15:00",
    courseId: "eap101", 
    name: "English for Academic Purposes 1", 
    room: "2.02", 
    type: "Seminar",
    instructor: "Schoer Amber",
    isFree: false
  },
  { 
    id: "s3_3",
    day: "Wednesday", 
    dayIndex: 3,
    time: "15:00 – 16:00", 
    startTime: "15:00",
    endTime: "16:00",
    courseId: "esl104", 
    name: "ESL Support (Academic & Study Skills)", 
    room: "2.05", 
    type: "Support",
    instructor: "Broodhuys Jochem",
    isFree: false
  },

  // THURSDAY
  { 
    id: "s4",
    day: "Thursday", 
    dayIndex: 4,
    time: "11:00 – 12:00", 
    startTime: "11:00",
    endTime: "12:00",
    courseId: "mss103", 
    name: "Maths Study Skills", 
    room: "Online (G01-04)", 
    type: "Online Large Group Teaching",
    instructor: "Jugmohan Janeeshla",
    isOnline: true,
    group: "G01-04",
    isFree: false
  },
  {
    id: "s4_free",
    day: "Thursday",
    dayIndex: 4,
    time: "12:00 – 18:00",
    startTime: "12:00",
    endTime: "18:00",
    name: "Free Time",
    type: "Free Period",
    isFree: true,
    note: "After 12:00 free"
  },

  // FRIDAY
  {
    id: "s5_free",
    day: "Friday",
    dayIndex: 5,
    time: "All Day",
    name: "Free day",
    type: "No Classes",
    isFree: true,
    isFreeDay: true,
    note: "No scheduled university classes"
  },

  // SATURDAY
  {
    id: "s6_weekend",
    day: "Saturday",
    dayIndex: 6,
    time: "All Day",
    name: "Weekend",
    type: "Weekend",
    isFree: true,
    isWeekend: true,
    note: "Weekend"
  },

  // SUNDAY
  {
    id: "s7_weekend",
    day: "Sunday",
    dayIndex: 0,
    time: "All Day",
    name: "Weekend",
    type: "Weekend",
    isFree: true,
    isWeekend: true,
    note: "Weekend"
  }
];

// Initialized tasks matching academic and personal responsibilities
export const INITIAL_TASKS = [
  {
    id: "task_1",
    title: "Finish EAP reading",
    description: "Read assigned journal article on scholarly discourse synthesis",
    completed: false,
    dueDate: "2026-10-05",
    dueTime: "18:00",
    priority: "high",
    courseId: "eap101",
    createdAt: "2026-10-01T10:00:00.000Z",
    updatedAt: "2026-10-01T10:00:00.000Z"
  },
  {
    id: "task_2",
    title: "Review algebra",
    description: "Practice vector problem sets and linear systems",
    completed: false,
    dueDate: "2026-10-05",
    dueTime: "20:00",
    priority: "medium",
    courseId: "mss103",
    createdAt: "2026-10-01T11:00:00.000Z",
    updatedAt: "2026-10-01T11:00:00.000Z"
  },
  {
    id: "task_3",
    title: "Prepare presentation",
    description: "Draft slides for Academic & Study Skills seminar",
    completed: false,
    dueDate: "2026-10-06",
    dueTime: "14:00",
    priority: "high",
    courseId: "ass102",
    createdAt: "2026-10-01T12:00:00.000Z",
    updatedAt: "2026-10-01T12:00:00.000Z"
  },
  {
    id: "task_4",
    title: "Email university administration",
    description: "Confirm enrollment documentation for semester 1",
    completed: false,
    dueDate: "2026-10-08",
    dueTime: "12:00",
    priority: "low",
    courseId: null,
    createdAt: "2026-10-02T09:00:00.000Z",
    updatedAt: "2026-10-02T09:00:00.000Z"
  },
  {
    id: "task_5",
    title: "Buy notebook",
    description: "Grid paper notebook for Maths Study Skills formulas",
    completed: true,
    dueDate: "2026-10-02",
    dueTime: "16:00",
    priority: "low",
    courseId: "mss103",
    createdAt: "2026-09-30T10:00:00.000Z",
    updatedAt: "2026-10-02T15:00:00.000Z"
  }
];

// Initialized as clean empty array — user will build notes as they create them
export const INITIAL_NOTES = [];

export const INITIAL_MATERIALS = [
  {
    id: "m1",
    title: "Lecture 01 - Academic Writing Foundations.pdf",
    courseId: "eap101",
    courseName: "English for Academic Purposes 1",
    week: "Week 01",
    size: "2.4 MB",
    type: "PDF Document",
    uploadDate: "22 Sep 2026",
    url: "#"
  },
  {
    id: "m2",
    title: "Reading Material - Critical Essay Structure.pdf",
    courseId: "eap101",
    courseName: "English for Academic Purposes 1",
    week: "Week 01",
    size: "1.2 MB",
    type: "PDF Reading",
    uploadDate: "23 Sep 2026",
    url: "#"
  },
  {
    id: "m3",
    title: "Seminar Material 02 - Source Synthesis Exercises.pdf",
    courseId: "eap101",
    courseName: "English for Academic Purposes 1",
    week: "Week 02",
    size: "890 KB",
    type: "PDF Document",
    uploadDate: "29 Sep 2026",
    url: "#"
  },
  {
    id: "m4",
    title: "Lecture 01 - Time Management & Study Habits.pdf",
    courseId: "ass102",
    courseName: "Academic and Study Skills",
    week: "Week 01",
    size: "3.1 MB",
    type: "PDF Document",
    uploadDate: "20 Sep 2026",
    url: "#"
  },
  {
    id: "m5",
    title: "Problem Set 01 - Algebraic Foundations & Solutions.pdf",
    courseId: "mss103",
    courseName: "Maths Study Skills",
    week: "Week 01",
    size: "1.5 MB",
    type: "PDF Sheet",
    uploadDate: "21 Sep 2026",
    url: "#"
  }
];

export const INITIAL_ASSIGNMENTS = [
  {
    id: "a1",
    title: "Academic Writing Task 01 - Literature Synthesis",
    courseId: "eap101",
    courseName: "English for Academic Purposes 1",
    dueDate: "2026-10-14",
    formattedDue: "Due 14 October 2026",
    status: "In Progress",
    weight: "20% of total grade",
    description: "Write a 1,200-word critical synthesis comparing three scholarly journal articles on academic integrity and modern technological tools.",
    requirements: [
      "Minimum 1,200 words",
      "APA 7th edition citation style",
      "Include structured abstract and bibliography"
    ],
    checklist: [
      { id: "c1", label: "Select 3 peer-reviewed articles from DMU Library", done: true },
      { id: "c2", label: "Draft outline and thesis statement", done: true },
      { id: "c3", label: "Write synthesis draft section", done: false },
      { id: "c4", label: "Proofread APA citations", done: false }
    ],
    notes: "Instructor Schoer Amber emphasized clear topic sentences for each paragraph."
  },
  {
    id: "a2",
    title: "Study Portfolio & Reflection 01",
    courseId: "ass102",
    courseName: "Academic and Study Skills",
    dueDate: "2026-10-22",
    formattedDue: "Due 22 October 2026",
    status: "In Progress",
    weight: "15% of total grade",
    description: "Document your weekly time audit and analyze personal productivity bottlenecks using Pomodoro and time-blocking frameworks.",
    requirements: [
      "Submit completed 7-day time tracking log",
      "Write 800-word reflective analysis"
    ],
    checklist: [
      { id: "c10", label: "Complete 7-day raw time log", done: true },
      { id: "c11", label: "Draft reflective summary", done: false }
    ],
    notes: "Andy Pacino requested honest analysis of digital distractions."
  }
];

export const INITIAL_EXAMS = [
  {
    id: "e1",
    title: "Mathematics Exam",
    courseId: "mss103",
    courseName: "Maths Study Skills",
    date: "TBD",
    time: "TBD",
    room: "TBD",
    status: "Date TBD",
    weight: "Final Assessment",
    topics: [
      "Algebraic Manipulations",
      "Functions & Equations",
      "Calculus Fundamentals",
      "Discrete Logic Notation"
    ],
    notes: "Exam date to be announced by DMUD examination department."
  },
  {
    id: "e2",
    title: "Academic English Exam",
    courseId: "eap101",
    courseName: "English for Academic Purposes 1",
    date: "TBD",
    time: "TBD",
    room: "TBD",
    status: "Date TBD",
    weight: "Final Written Exam",
    topics: [
      "Academic Essay Writing",
      "Critical Source Analysis",
      "Grammar & Academic Register"
    ],
    notes: "Official timetable pending."
  },
  {
    id: "e3",
    title: "Computer Programming Exam",
    courseId: "cs_future",
    courseName: "Computer Programming",
    date: "TBD",
    time: "TBD",
    room: "TBD",
    status: "Date TBD",
    weight: "Degree Core",
    topics: [
      "Algorithmic Logic",
      "Data Structures",
      "Object Oriented Concepts"
    ],
    notes: "Degree module assessment."
  }
];

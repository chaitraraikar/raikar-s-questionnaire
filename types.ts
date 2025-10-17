
export interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface TestConfig {
  questions: Question[];
  timeLimit: number; // in minutes
}

export type Answer = number | null; // index of the selected option, or null if not answered

export enum AppState {
    Home = 'home',
    TutorLogin = 'tutor-login',
    TutorDashboard = 'tutor-dashboard',
    StudentTest = 'student-test',
    StudentResults = 'student-results',
}

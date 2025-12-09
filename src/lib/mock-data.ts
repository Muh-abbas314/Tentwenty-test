
export interface User {
  id: string;
  email: string;
  password: string; 
  name: string;
}

export interface TimesheetEntry {
  id: string;
  date: string; 
  project: string;
  typeOfWork: string;
  taskDescription: string;
  hours: number;
}

export interface WeeklyTimesheet {
  id: string;
  weekNumber: number;
  startDate: string; 
  endDate: string;
  entries: TimesheetEntry[];
  status: 'COMPLETED' | 'INCOMPLETE' | 'MISSING';
}

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'm.abbas@example.com',
    password: 'password123', 
    name: 'Mohammad Abbas',
  },
  {
    id: '2',
    email: 'ali.ahmed@example.com',
    password: 'password123',
    name: 'Ali Ahmed',
  },
];

export const mockWeeklyTimesheets: WeeklyTimesheet[] = [
  {
    id: '1',
    weekNumber: 1,
    startDate: '2024-01-01', // Monday
    endDate: '2024-01-05',   // Friday
    status: 'COMPLETED',
    entries: [
      // Monday - 8 hours
      { id: '1-1', date: '2024-01-01', project: 'Project Alpha', typeOfWork: 'Development', taskDescription: 'Homepage Development', hours: 5 },
      { id: '1-2', date: '2024-01-01', project: 'Project Beta', typeOfWork: 'Testing', taskDescription: 'Unit testing', hours: 3 },
      // Tuesday - 8 hours
      { id: '1-3', date: '2024-01-02', project: 'Project Alpha', typeOfWork: 'Development', taskDescription: 'API Integration', hours: 6 },
      { id: '1-4', date: '2024-01-02', project: 'Project Gamma', typeOfWork: 'Bug fixes', taskDescription: 'Fix login issue', hours: 2 },
      // Wednesday - 8 hours
      { id: '1-5', date: '2024-01-03', project: 'Project Beta', typeOfWork: 'Development', taskDescription: 'Dashboard UI', hours: 4 },
      { id: '1-6', date: '2024-01-03', project: 'Project Alpha', typeOfWork: 'Design', taskDescription: 'UI mockups', hours: 4 },
      // Thursday - 8 hours
      { id: '1-7', date: '2024-01-04', project: 'Project Gamma', typeOfWork: 'Development', taskDescription: 'Feature implementation', hours: 7 },
      { id: '1-8', date: '2024-01-04', project: 'Project Beta', typeOfWork: 'Documentation', taskDescription: 'API documentation', hours: 1 },
      // Friday - 8 hours
      { id: '1-9', date: '2024-01-05', project: 'Project Alpha', typeOfWork: 'Testing', taskDescription: 'Integration testing', hours: 3 },
      { id: '1-10', date: '2024-01-05', project: 'Project Beta', typeOfWork: 'Development', taskDescription: 'Code review and refactoring', hours: 5 },
    ],
  },
  {
    id: '2',
    weekNumber: 2,
    startDate: '2024-01-08', // Monday
    endDate: '2024-01-12',   // Friday
    status: 'COMPLETED',
    entries: [
      // Monday - 8 hours
      { id: '2-1', date: '2024-01-08', project: 'Project Alpha', typeOfWork: 'Development', taskDescription: 'User authentication', hours: 6 },
      { id: '2-2', date: '2024-01-08', project: 'Project Name', typeOfWork: 'Design', taskDescription: 'Wireframe design', hours: 2 },
      // Tuesday - 8 hours
      { id: '2-3', date: '2024-01-09', project: 'Project Beta', typeOfWork: 'Development', taskDescription: 'Database schema', hours: 5 },
      { id: '2-4', date: '2024-01-09', project: 'Project Gamma', typeOfWork: 'Bug fixes', taskDescription: 'Fix performance issues', hours: 3 },
      // Wednesday - 8 hours
      { id: '2-5', date: '2024-01-10', project: 'Project Alpha', typeOfWork: 'Development', taskDescription: 'Payment integration', hours: 7 },
      { id: '2-6', date: '2024-01-10', project: 'Project Beta', typeOfWork: 'Testing', taskDescription: 'E2E testing', hours: 1 },
      // Thursday - 8 hours
      { id: '2-7', date: '2024-01-11', project: 'Project Gamma', typeOfWork: 'Development', taskDescription: 'Admin panel', hours: 4 },
      { id: '2-8', date: '2024-01-11', project: 'Project Name', typeOfWork: 'Development', taskDescription: 'Mobile responsive', hours: 4 },
      // Friday - 8 hours
      { id: '2-9', date: '2024-01-12', project: 'Project Alpha', typeOfWork: 'Documentation', taskDescription: 'User guide', hours: 2 },
      { id: '2-10', date: '2024-01-12', project: 'Project Beta', typeOfWork: 'Development', taskDescription: 'Feature enhancements', hours: 6 },
    ],
  },
  {
    id: '3',
    weekNumber: 3,
    startDate: '2024-01-15', // Monday
    endDate: '2024-01-19',   // Friday
    status: 'INCOMPLETE',
    entries: [
      // Monday - 8 hours
      { id: '3-1', date: '2024-01-15', project: 'Project Alpha', typeOfWork: 'Development', taskDescription: 'New feature development', hours: 5 },
      { id: '3-2', date: '2024-01-15', project: 'Project Beta', typeOfWork: 'Testing', taskDescription: 'Test cases', hours: 3 },
      // Tuesday - 8 hours
      { id: '3-3', date: '2024-01-16', project: 'Project Gamma', typeOfWork: 'Development', taskDescription: 'Backend API', hours: 6 },
      { id: '3-4', date: '2024-01-16', project: 'Project Alpha', typeOfWork: 'Bug fixes', taskDescription: 'Critical bug fixes', hours: 2 },
      // Wednesday - 4 hours (incomplete day)
      { id: '3-5', date: '2024-01-17', project: 'Project Beta', typeOfWork: 'Development', taskDescription: 'Frontend components', hours: 4 },
      // Thursday - 0 hours (missing)
      // Friday - 0 hours (missing)
    ],
  },
  {
    id: '4',
    weekNumber: 4,
    startDate: '2024-01-22', // Monday
    endDate: '2024-01-26',   // Friday
    status: 'COMPLETED',
    entries: [
      // Monday - 8 hours
      { id: '4-1', date: '2024-01-22', project: 'Project Name', typeOfWork: 'Development', taskDescription: 'Search functionality', hours: 6 },
      { id: '4-2', date: '2024-01-22', project: 'Project Alpha', typeOfWork: 'Design', taskDescription: 'UI improvements', hours: 2 },
      // Tuesday - 8 hours
      { id: '4-3', date: '2024-01-23', project: 'Project Beta', typeOfWork: 'Development', taskDescription: 'Data visualization', hours: 5 },
      { id: '4-4', date: '2024-01-23', project: 'Project Gamma', typeOfWork: 'Testing', taskDescription: 'Load testing', hours: 3 },
      // Wednesday - 8 hours
      { id: '4-5', date: '2024-01-24', project: 'Project Alpha', typeOfWork: 'Development', taskDescription: 'Email notifications', hours: 4 },
      { id: '4-6', date: '2024-01-24', project: 'Project Name', typeOfWork: 'Development', taskDescription: 'Report generation', hours: 4 },
      // Thursday - 8 hours
      { id: '4-7', date: '2024-01-25', project: 'Project Beta', typeOfWork: 'Bug fixes', taskDescription: 'Fix data export', hours: 3 },
      { id: '4-8', date: '2024-01-25', project: 'Project Gamma', typeOfWork: 'Development', taskDescription: 'New module', hours: 5 },
      // Friday - 8 hours
      { id: '4-9', date: '2024-01-26', project: 'Project Alpha', typeOfWork: 'Documentation', taskDescription: 'Technical docs', hours: 2 },
      { id: '4-10', date: '2024-01-26', project: 'Project Beta', typeOfWork: 'Development', taskDescription: 'Performance optimization', hours: 6 },
    ],
  },
  {
    id: '5',
    weekNumber: 5,
    startDate: '2024-01-29', // Monday
    endDate: '2024-02-02',   // Friday
    status: 'MISSING',
    entries: [],
  },
];

export const mockProjects = [
  'Project Alpha',
  'Project Beta',
  'Project Gamma',
  'Project Name',
];

export const mockTypesOfWork = [
  'Development',
  'Bug fixes',
  'Testing',
  'Design',
  'Documentation',
];


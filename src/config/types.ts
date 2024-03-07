// Request Type
type StatusType = 'in_progress';
type SortOrder = 'asc' | 'desc';

export interface FilterClauseType {
  id: string;
  condition: 'equals' | 'does_not_equal' | 'greater_than' | 'less_than';
  value: number | string;
}

export interface RequestParameters {
  limit?: number; // Optional, 1-150
  afterDate?: string; // Optional, format: "YYYY-MM-DDTHH:mm:ss.sssZ"
  beforeDate?: string; // Optional, format: "YYYY-MM-DDTHH:mm:ss.sssZ"
  offset?: number; // Optional, default is 0
  status?: StatusType; // Optional, default is finished submissions
  includeEditLink?: boolean; // Optional, default is false
  sort?: SortOrder; // Optional, default is 'asc'
  filters?: string;
}

// Response Type
// would add exhaustive list of question types here & disregard undefined types per docs
type QuestionType = string;
type CalculationType = 'number' | 'text';

export interface Question {
  id: string;
  name: string;
  type: QuestionType;
  value: string;
}

interface Calculation {
  id: string;
  name: string;
  type: CalculationType;
  value: string;
}

interface URLParameter {
  id: string;
  name: string;
  value: string;
}

interface Quiz {
  score: number;
  maxScore: number;
}

export interface FormResponse {
  questions: Question[];
  calculations: Calculation[];
  urlParameters: URLParameter[];
  quiz?: Quiz;
  submissionId: string;
  submissionTime: string;
}

export interface ApiResponse {
  responses: FormResponse[];
  totalResponses: number;
  pageCount: number;
}

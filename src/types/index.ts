export type CategoryId =
  | 'rent'
  | 'energy'
  | 'jobcenter'
  | 'health'
  | 'garnishment'
  | 'schufa'
  | 'family';

export type QuestionType = 'text' | 'number' | 'date' | 'select' | 'textarea';

export interface Category {
  id: CategoryId;
  title: string;
  shortTitle: string;
  description: string;
  primaryContact: string;
}

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  category?: CategoryId;
  text: string;
  help?: string;
  type: QuestionType;
  options?: QuestionOption[];
  placeholder?: string;
  required?: boolean;
}

export type Answers = Record<string, string>;

export interface ResultContent {
  situation: string[];
  today: string[];
  tomorrow: string[];
  help: string[];
  avoid: string[];
}

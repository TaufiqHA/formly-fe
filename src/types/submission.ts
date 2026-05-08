export interface SubmissionNote {
  id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export interface SubmissionValue {
  field_label: string;
  value_text: string | null;
  value_json: any | null;
}

export interface Submission {
  id: string;
  submission_number: string;
  customer_name?: string;
  customer_phone?: string;
  name?: string;
  phone?: string;
  whatsapp?: string;
  form_title?: string;
  status: 'new' | 'read' | 'done' | string;
  submitted_at: string;
  values?: SubmissionValue[];
  notes?: SubmissionNote[];
}

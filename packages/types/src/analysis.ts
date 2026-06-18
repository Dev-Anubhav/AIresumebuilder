export interface ExtractedField {
  field: string;
  value: string;
  pageReference: string;
  confidence: number;
  category: 'Dates' | 'Parties' | 'Amounts' | 'Clauses' | 'Terms' | string;
}

export interface DocumentAnalysis {
  id: string;
  documentId: string;
  summary: string;
  keyInsights: string[];
  extractedData: ExtractedField[];
  documentType: string;
  language: string;
  sentiment?: string | null;
  riskFlags?: string[] | null;
  createdAt: Date | string;
}

export interface Annotation {
  id: string;
  documentId: string;
  userId: string;
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  color: string;
  createdAt: Date | string;
}

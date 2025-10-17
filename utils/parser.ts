import type { Question } from '../types';

// Declare XLSX to inform TypeScript about the global variable from the CDN
declare const XLSX: any;

export const parseExcel = (data: ArrayBuffer): Question[] => {
  const workbook = XLSX.read(data, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
      throw new Error("The Excel file contains no sheets.");
  }
  const worksheet = workbook.Sheets[sheetName];
  const json: any[] = XLSX.utils.sheet_to_json(worksheet);

  if (json.length === 0) {
    throw new Error("The Excel file is empty or has no data rows.");
  }

  // Define ALL headers we expect in the Excel file for validation.
  const requiredHeaders = [
    'Q#',
    'Question Text',
    'Option A',
    'Option B',
    'Option C',
    'Option D',
    'Correct Answer',
  ];
  
  const actualHeaders = Object.keys(json[0]);
  const hasAllHeaders = requiredHeaders.every(h => actualHeaders.includes(h));

  if (!hasAllHeaders) {
    throw new Error(`Excel file must contain the following headers: ${requiredHeaders.join(', ')}`);
  }

  return json.map((row, index) => {
    try {
      // Use string literals for mapping to avoid confusion
      const questionText = row['Question Text'];
      const options = [
        row['Option A'],
        row['Option B'],
        row['Option C'],
        row['Option D'],
      ];
      const correctAnswerLetter = row['Correct Answer']?.toString().trim().toUpperCase();

      if (!questionText || options.some(opt => opt === undefined || opt === null)) {
        console.warn(`Skipping row ${index + 2}: Missing question or one or more options.`);
        return null;
      }
      
      const optionStrings = options.map(opt => String(opt));

      let correctAnswerIndex: number;
      switch (correctAnswerLetter) {
        case 'A': correctAnswerIndex = 0; break;
        case 'B': correctAnswerIndex = 1; break;
        case 'C': correctAnswerIndex = 2; break;
        case 'D': correctAnswerIndex = 3; break;
        default:
          console.warn(`Skipping row ${index + 2}: Invalid 'Correct Answer' value: '${correctAnswerLetter}'. Expected 'A', 'B', 'C', or 'D'.`);
          return null;
      }

      return {
        question: String(questionText),
        options: optionStrings,
        correctAnswerIndex: correctAnswerIndex,
      };
    } catch (e) {
      console.error(`Error processing row ${index + 2}:`, e);
      return null;
    }
  }).filter((q): q is Question => q !== null);
};
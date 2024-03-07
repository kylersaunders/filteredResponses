import express, { Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import { DEMO_API_KEY } from './config/constants';
import { ApiResponse, FilterClauseType, FormResponse, Question, RequestParameters } from './config/types';
import { formResponses } from './data/responses';

const app = express();
const port = process.env.PORT || 3000;

app.get('/:formId/filteredResponses', async (req: Request, res: Response) => {
  const { formId } = req.params;
  let { limit, afterDate, beforeDate, offset, status, includeEditLink, sort, filters }: RequestParameters = req.query;

  // Validate and set default values for query parameters
  // @ts-ignore
  limit = limit ? Number(limit) : 150;
  // @ts-ignore
  offset = offset ? Number(offset) : 0;

  // Validation for 'limit' parameter
  // @ts-ignore
  if (limit < 1 || limit > 150) {
    return res.status(400).json({ message: 'Limit must be a number between 1 and 150.' });
  }

  // Validation for date parameters
  const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
  if (afterDate && !dateFormat.test(afterDate as string)) {
    return res.status(400).json({ message: 'afterDate must be in YYYY-MM-DDTHH:mm:ss.sssZ format.' });
  }
  if (beforeDate && !dateFormat.test(beforeDate as string)) {
    return res.status(400).json({ message: 'beforeDate must be in YYYY-MM-DDTHH:mm:ss.sssZ format.' });
  }

  // Validate 'sort' parameter
  if (sort && sort !== 'asc' && sort !== 'desc') {
    return res.status(400).json({ message: 'Sort must be either asc or desc.' });
  }

  const params: RequestParameters = {
    offset,
    limit,
    afterDate,
    beforeDate,
    status,
    includeEditLink,
    sort,
  };

  try {
    const apiRes = await axios.get(`https://api.fillout.com/v1/api/forms/${formId}/submissions`, {
      headers: { Authorization: `Bearer ${DEMO_API_KEY}` },
      params,
    });

    let filteredResponses: FormResponse[] = apiRes.data.responses;
    if (filters) {
      let parsedFilters: FilterClauseType[];

      try {
        parsedFilters = JSON.parse(filters);
      } catch (error) {
        return res.status(400).json({ message: 'Filters must be a valid JSON of the types shown in the API docs.' });
      }

      if (!Array.isArray(parsedFilters)) {
        return res.status(400).json({ message: 'Filters must be an array of the types shown in the API docs.' });
      }
      if (parsedFilters.some((filter: FilterClauseType) => !filter.id || !filter.condition || !filter.value)) {
        return res.status(400).json({ message: 'Filters must contain question id, condition and value.' });
      }
      if (parsedFilters.some((filter: FilterClauseType) => !['equals', 'does_not_equal', 'greater_than', 'less_than'].includes(filter.condition))) {
        return res.status(400).json({ message: 'Condition must be one of equals, does_not_equal, greater_than, less_than.' });
      }

      filteredResponses = filteredResponses.filter((response: FormResponse) =>
        parsedFilters.every((filter) => response.questions.some((question: Question) => question.id === filter.id && matchCondition(question.value, filter)))
      );
    }

    res.json({
      responses: filteredResponses,
      totalResponses: filteredResponses.length,
      pageCount: Math.ceil(filteredResponses.length / Number(limit)),
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    res.status(500).json({ message: 'Error fetching form responses', error: axiosError.message });
  }
});

function matchCondition(value: string, filter: FilterClauseType): boolean {
  switch (filter.condition) {
    case 'equals':
      return value == filter.value;
    case 'does_not_equal':
      return value != filter.value;
    case 'greater_than':
      return new Date(value) > new Date(filter.value);
    case 'less_than':
      return new Date(value) < new Date(filter.value);
    default:
      return false;
  }
}

// to let jest close the instance
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = server;

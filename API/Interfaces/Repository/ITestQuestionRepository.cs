﻿using API.Dtos;
using API.Models;

namespace API.Interfaces.Repository
{
    public interface ITestQuestionRepository
    {
        IEnumerable<QuestionDto> GettAllQuestionsFromTest(int testId);
        IEnumerable<QuestionDto> GetUnselectedQuestions(int testId);
        IEnumerable<PersonDto> GetAllPersonResolvingTest(int testId);
        void AddQuestionToTest(int testId, int questionId);
        void RemoveQuestionFromTest(int testId, int questionId);
        bool UpdateAllQuestions(string obj, int testId);
        bool SaveAll();
    }
}

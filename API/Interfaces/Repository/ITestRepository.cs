using API.Dtos;

namespace API.Interfaces.Repository
{
    public interface ITestRepository
    {
        void Create(TestDto test);
        IEnumerable<TestDto> GetAllTests();
        IEnumerable<QuestionDto> GettAllQuestionsFromTest(int testId);
        TestDto GetTestById(int id);
        IEnumerable<TestDto> GetTestByTrainerIdId(int trainerId);
        IEnumerable<QuestionDto> GetUnselectedQuestions(int testId);
        void AddQuestionToTest(int testId, int questionId);
        void RemoveQuestionFromTest(int testId,int questionId);
        void Update(TestDto test);
        void AddTestToStudent(int testId,int internId);
        void AddTestToGroup(int testId,int groupId);
        void RemoveTestFromGruop(int testId,int groupId);
        void RemoveTestFromStudents(int testId,int internId);
        void Delete(int test);
        void StopEdit(int id);
        bool UpdateAllQuestions(string obj, int testId);
        bool UpdateAllTestInters(string obj, int testId);
        bool UpdateAllTestGroups(string obj, int testId);
        bool SaveAll();
    }
}
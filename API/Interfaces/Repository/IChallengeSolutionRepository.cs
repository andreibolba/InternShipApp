﻿using API.Dtos;

namespace API.Interfaces.Repository
{
    public interface IChallengeSolutionRepository
    {
        public ChallengeSolutionDto CreateSolution(ChallengeSolutionDto solution);
        public ChallengeSolutionDto UpdateSolution(ChallengeSolutionDto solution);
        public void DeleteSolution(int id);
        public ChallengeSolutionDto GetSolutionById(int id);
        public IEnumerable<ChallengeSolutionDto> GetAllSolutions();
        public IEnumerable<ChallengeSolutionDto> GetAllSolutionsForIntern(int internId);
        public IEnumerable<ChallengeSolutionDto> GetAllSolutionsForInternForChallenge(int internId, int challengeId);
        public IEnumerable<ChallengeSolutionDto> GetAllSolutionsForChallenge(int ChallengeId);
        public IEnumerable<ChallengeSolutionDto> GetAllSolutionsForSpecificDay(DateTime time);
        public void ApproveDeclineSolutin(int solutionId, bool approved, int points);
        public bool SaveAll();

    }
}

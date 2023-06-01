﻿using API.Dtos;
using API.Interfaces.Repository;
using API.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class ChallengeRepository : IChallengeRepository
    {
        private readonly InternShipAppSystemContext _context;
        private readonly IMapper _mapper;

        public ChallengeRepository(InternShipAppSystemContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public ChallengeDto CreateChallenge(ChallengeDto challange)
        {
            var challangeToDb = _mapper.Map<Challange>(challange);

            challangeToDb.DateOfPost = DateTime.Now;

            _context.Challanges.Add(challangeToDb);

            return SaveAll() ? _mapper.Map<ChallengeDto>(challangeToDb) : null;
        }

        public void DeleteChallenge(int id)
        {
            var challange = _mapper.Map<Challange>(GetChallengeById(id));
            challange.Deleted= true;
            foreach(var s in _context.ChallangeSolutions.Where(d=>d.Deleted==false&& d.ChallangeId == id))
            {
                s.Deleted= true;
                _context.ChallangeSolutions.Update(s);
            }
        }

        public IEnumerable<ChallengeDto> GetAllChallenges()
        {
            var res = _context.Challanges.Where(d => d.Deleted == false).Include(g => g.Trainer);
            return _mapper.Map<IEnumerable<ChallengeDto>>(res);
        }

        public ChallengeDto GetAllChallengeForSpecificDay(DateTime time)
        {
            return GetAllChallenges().FirstOrDefault(c=>c.DateOfPost.Value.Day == time.Day && c.DateOfPost.Value.Month == time.Month && c.DateOfPost.Value.Year == time.Year);
        }

        public ChallengeDto GetChallengeById(int id)
        {
            return GetAllChallenges().FirstOrDefault(c => c.ChallangeId == id);
        }

        public bool SaveAll()
        {
            return _context.SaveChanges() > 0;
        }

        public ChallengeDto UpdateChallenge(ChallengeDto challange)
        {
            var challangeToUpdate = _mapper.Map<Challange>(GetChallengeById(challange.ChallangeId));

            challangeToUpdate.ChallangeName = challange.ChallangeName==null? challangeToUpdate.ChallangeName : challange.ChallangeName;
            challangeToUpdate.ChallangeDescription = challange.ChallangeDescription == null? challangeToUpdate.ChallangeDescription : challange.ChallangeDescription;
            challangeToUpdate.Deadline = challange.Deadline == null? challangeToUpdate.Deadline : challange.Deadline;

            _context.Challanges.Update(challangeToUpdate);

            return SaveAll() ? _mapper.Map<ChallengeDto>(challangeToUpdate) : null;
        }
    }
}
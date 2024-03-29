﻿using API.Dtos;
using API.Interfaces.Repository;
using API.Models;
using AutoMapper;
using Microsoft.Extensions.Options;

namespace API.Data
{
    public class StatsRepository : IStatsRepository
    {
        private InternShipAppSystemContext _context;
        private IMapper _mapper;

        public StatsRepository(InternShipAppSystemContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public bool AddView(PostViewDto post)
        {
            var view = _context.PostViews.SingleOrDefault(v => v.PersonId == post.PersonId && v.PostId == post.PostId);
            if (view == null)
            {
                var postToAdd = _mapper.Map<PostView>(post);
                postToAdd.Deleted = false;
                _context.PostViews.Add(postToAdd);
                return true;
            }
            return false;
        }

        public void Vote(PostCommentReactionDto vote)
        {
            var reaction = _context.PostCommentReactions.FirstOrDefault(v=>
            v.PersonId == vote.PersonId 
            && (v.PostId == vote.PostId || v.CommentId == vote.CommentId));
            if(reaction != null)
            {
                reaction.Upvote = vote.Upvote.Value;
                reaction.DownVote = vote.Downvote.Value;
                reaction.Deleted = false;
                _context.PostCommentReactions.Update(reaction);
                return;
            }
            var voteToAdd = _mapper.Map<PostCommentReaction>(vote);
            voteToAdd.Deleted = false;
            _context.PostCommentReactions.Add(voteToAdd);
        }

        
        public bool SaveAll()
        {
            return _context.SaveChanges() > 0;
        }
    }
}

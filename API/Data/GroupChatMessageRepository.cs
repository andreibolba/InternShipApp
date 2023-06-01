﻿using API.Dtos;
using API.Interfaces.Repository;
using API.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class GroupChatMessageRepository : IGroupChatMessagesRepostitory
    {
        private readonly InternShipAppSystemContext _context;
        private readonly IGroupChatRepository _groupChatRepository;
        private readonly IPersonRepository _personRepository;
        private readonly IMapper _mapper;

        public GroupChatMessageRepository(InternShipAppSystemContext context, IGroupChatRepository groupChatRepository, IPersonRepository personRepository, IMapper mapper)
        {
            _context = context;
            _groupChatRepository = groupChatRepository;
            _personRepository = personRepository;
            _mapper = mapper;
        }

        public void DeleteMessage(int groupChatMessageId)
        {
            var mess = _mapper.Map<GroupChatMessage>(GetMessageById(groupChatMessageId));
            mess.Deleted = true;
            _context.GroupChatMessages.Update(mess);
        }

        public IEnumerable<GroupChatMessageDto> GetAllMessages()
        {
            var allMessages = _context.GroupChatMessages.Where(m => m.Deleted == false).Include(m => m.GroupChat).Include(m => m.Person);
            return _mapper.Map<IEnumerable<GroupChatMessageDto>>(allMessages);
        }

        public IEnumerable<GroupChatMessageDto> GetAllMessagesForAGroup(int groupChatId)
        {
            return GetAllMessages().Where(m=>m.GroupChatId== groupChatId);
        }

        public GroupChatMessageDto GetMessageById(int groupChatMessageId)
        {
            var mess = GetAllMessages().FirstOrDefault(m => m.GroupChatMessageId == groupChatMessageId);
            return mess;
        }

        public bool SaveAll()
        {
            return _context.SaveChanges() > 0;
        }

        public GroupChatMessageDto SendMessage(GroupChatMessageDto message)
        {
            var messageToDb = _mapper.Map<GroupChatMessage>(message);
            messageToDb.SendDate = DateTime.Now;
            _context.GroupChatMessages.Add(messageToDb);
            var mess = _mapper.Map<GroupChatMessageDto>(messageToDb);
            mess.Person = _personRepository.GetPersonById(messageToDb.PersonId);
            mess.GroupChat = _groupChatRepository.GetGroupChatById(messageToDb.GroupChatId);
            return SaveAll() ? mess: null;
        }

    }
}
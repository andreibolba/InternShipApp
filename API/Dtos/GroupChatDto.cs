﻿using API.Models;

namespace API.Dtos
{
    public class GroupChatDto
    {
        public int GroupChatId { get; set; }
        public string GroupChatName { get; set; }
        public string GroupChatDescription { get; set; }
        public int? AdminId { get; set; }
        public PersonDto Admin { get; set; }
        public int? PictureId { get; set; }
        public PictureDto Picture { get; set; }
        public IEnumerable<PersonDto> Participants { get; set; }
    }
}

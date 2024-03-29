﻿using API.Models;

namespace API.Dtos
{
    public class TaskDto
    {
        public int TaskId { get; set; }

        public string TaskName { get; set; }

        public string TaskDescription { get; set; }

        public int TrainerId { get; set; }

        public DateTime DateOfPost { get; set; }

        public PersonDto Trainer { get; set; }
    }
}

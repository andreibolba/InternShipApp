﻿using API.Dtos;

namespace API.Interfaces.Repository
{
    public interface ITaskRepository
    {
        public TaskDto AddTask(TaskDto taskDto);
        public TaskDto UpdateTask(TaskDto taskDto);
        public void DeleteTask(int taskId);
        public TaskDto GetTaskById(int taskId);
        public IEnumerable<TaskDto> GetAllTasks();
        public IEnumerable<TaskDto> GetAllTasksForTrainer(int trainerId);
        public IEnumerable<TaskDto> GetAllTasksForGroup(int groupId);
        public IEnumerable<TaskInternDto> GetAllInternsChecked(int taskId);
        public IEnumerable<TaskGroupDto> GetAllGroupsChecked(int taskId);
        public bool SaveAll();

    }
}

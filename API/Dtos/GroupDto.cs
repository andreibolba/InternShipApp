namespace API.Dtos
{
    public class GroupDto
    {
        public int GroupId { get; set; }
        public string GroupName { get; set; }
        public PersonDto Trainer { get; set; }
        public int TrainerId { get; set; }
        public List<PersonDto> AllInterns {get;set;}
    }
}
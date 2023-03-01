using AutoMapper;
using API.Models;
using API.Dtos;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        protected AutoMapperProfiles()
        {
            CreateMap<Person, PersonDto>();
            CreateMap<Group, GroupDto>();
            CreateMap<InternGroup, InternGroupDto>();
            CreateMap<Logging, LoggingDto>();
        }
    }
}
using API.Data;
using API.Interfaces;
using API.Interfaces.Repository;
using API.Models;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
            IConfiguration config)
        {
            services.AddDbContext<InternShipAppSystemContext>(options =>
            options.UseSqlServer(config.GetConnectionString("dbconn")));
            services.AddCors();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IPersonRepository, PersonRepository>();
            services.AddScoped<IGroupRepository, GroupRepository>();
            services.AddScoped<ILoggRepository, LoggRepository>();
            services.AddScoped<IInternGroupRepository, InternGroupRepository>();
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            return services;
        }
    }
}
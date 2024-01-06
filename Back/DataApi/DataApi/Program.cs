using DataApi.Hosted;
using DataApi.Models;
using DataApi.Providers;
using DataApi.Services.YandexAfisha;
using Microsoft.EntityFrameworkCore;
using Refit;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
builder.Services
    .AddDbContext<ApplicationDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetValue<string>("PgSql:ConnectionString")));

builder.Services
    .AddRefitClient<IYandexAfishaProvider>()
    .ConfigureHttpClient(options => options.BaseAddress = new Uri("https://afisha.yandex.ru"));

builder.Services
    .AddSingleton<IYandexAfishaService, YandexAfishaService>();

builder.Services.AddHostedService<EventsDataUpdaterHostedService>();

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

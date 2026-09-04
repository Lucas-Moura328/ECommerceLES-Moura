using ECommerceBackend.Facade.Cliente;
using ECommerceBackend.Models.Responses;
using ECommerceBackend.Persistence;
using ECommerceBackend.Services.ClienteService;
using ECommerceBackend.Services.Endereco;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddCors(options =>
{
    options.AddPolicy("Angular", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services
    .AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState
                .Where(x => x.Value?.Errors.Count > 0)
                .SelectMany(x => x.Value!.Errors.Select(error =>
                    new ValidationError
                    {
                        Campo = x.Key,
                        Mensagem = error.ErrorMessage
                    }))
                .ToList();

            return new BadRequestObjectResult(
                new Response<List<ValidationError>>
                {
                    Message = "Existem erros de validação.",
                    Dados = errors
                });
        };
    });

builder.Services.AddDbContext<ECommerceDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IClienteFacade, ClienteFacade>();
builder.Services.AddScoped<IClienteService, ClienteService>();
builder.Services.AddScoped<IEnderecoService, EnderecoService>();
//builder.Services.AddScoped<ICartaoService, CartaoService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseMiddleware<ECommerceBackend.Middlewares.ExceptionMiddleware>();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("Angular");

app.UseAuthorization();

app.MapControllers();

app.Run();

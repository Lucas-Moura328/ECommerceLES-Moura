using ECommerceBackend.Exceptions;
using ECommerceBackend.Models.Responses;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;

namespace ECommerceBackend.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (BusinessException ex)
            {
                context.Response.StatusCode = 400;

                await context.Response.WriteAsJsonAsync(
                    new Response<object>
                    {
                        Message = ex.Message
                    });
            }
            catch (Exception)
            {
                context.Response.StatusCode = 500;

                await context.Response.WriteAsJsonAsync(
                    new Response<object>
                    {
                        Message = "Erro interno do servidor."
                    });
            }
        }
    }
}
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
                context.Response.StatusCode = StatusCodes.Status400BadRequest;

                await context.Response.WriteAsJsonAsync(
                    new Response<object>
                    {
                        Message = ex.Message
                    });
            }
            catch (NotFoundException ex)
            {
                context.Response.StatusCode = StatusCodes.Status404NotFound;

                await context.Response.WriteAsJsonAsync(
                    new Response<object>
                    {
                        Message = ex.Message
                    });
            }
            catch (UnauthorizedException ex)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsJsonAsync(
                    new Response<object>
                    {
                        Message = ex.Message
                    });
            }
            catch (Exception)
            {
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;

                await context.Response.WriteAsJsonAsync(
                    new Response<object>
                    {
                        Message = "Erro interno do servidor."
                    });
            }
        }
    }
}
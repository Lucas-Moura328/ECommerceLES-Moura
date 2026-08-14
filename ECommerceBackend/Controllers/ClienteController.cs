using ECommerceBackend.DTOs.ClienteDto;
using ECommerceBackend.Models.Domain;
using ECommerceBackend.Models.Responses;
using ECommerceBackend.Services.ClienteService;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClienteController : ControllerBase
    {
        private readonly IClienteService _service;

        public ClienteController(IClienteService service)
        {
            _service = service;
        }



        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var clientes = await _service.GetAll();

            var response = new Response<ClienteResponseDto>
            {
                StatusCode = StatusCodes.Status200OK,
                Dados = clientes
            };

            return Ok(response);
        }



        /*[HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var cliente = await _service.GetById(id);

            if (cliente == null)
                return NotFound();

            return Ok(cliente);
        }*/
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Response<ClienteResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<ClienteResponseDto>), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Response<ClienteResponseDto>>> GetById(Guid id)
        {
            var cliente = await _service.GetById(id);

            if (cliente == null)
            {
                var responseNotFound = new Response<ClienteResponseDto>
                {
                    StatusCode = StatusCodes.Status404NotFound
                };

                responseNotFound.Messages.Add(new MessagesError
                {
                    CriticalLevel = CriticalLevelLayer.Normal.ToString(),
                    Message = "Cliente não encontrado."
                });

                return NotFound(responseNotFound);
            }



            var response = new Response<ClienteResponseDto>
            {
                StatusCode = StatusCodes.Status200OK,
                Dados = new List<ClienteResponseDto>{ cliente }
            };

            return Ok(response);
        }


        [HttpPost]
        [ProducesResponseType(typeof(Response<ClienteResponseDto>), StatusCodes.Status201Created)]
        public async Task<IActionResult> Create(ClienteCreateDto dto)
        {
            var cliente = await _service.Create(dto);

            var response = new Response<ClienteResponseDto>
            {
                StatusCode = StatusCodes.Status201Created,

                Dados = new List<ClienteResponseDto>{ cliente }
            };

            
            return CreatedAtAction(
                nameof(GetById),
                new { id = cliente.IdCliente },
                response);
        }



        [HttpPut("{id}")]
        [ProducesResponseType(typeof(Response<ClienteResponseDto>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(Response<ClienteResponseDto>), StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(Response<ClienteResponseDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(Guid id, ClienteUpdateDto dto)
        {
            var atualizado = await _service.Update(id, dto);

            if (!atualizado)
            {
                var response = new Response<ClienteResponseDto>
                {
                    StatusCode = StatusCodes.Status404NotFound
                };

                response.Messages.Add(new MessagesError
                {
                    CriticalLevel = CriticalLevelLayer.Normal.ToString(),
                    Message = "Cliente não encontrado."
                });

                return NotFound(response);
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(Response<ClienteResponseDto>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(Response<ClienteResponseDto>), StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Delete(Guid id)
        {
            var removido = await _service.Delete(id);

            if (!removido)
            {
                var response = new Response<ClienteResponseDto>
                {
                    StatusCode = StatusCodes.Status404NotFound
                };

                response.Messages.Add(new MessagesError
                {
                    CriticalLevel = CriticalLevelLayer.Normal.ToString(),
                    Message = "Cliente não encontrado."
                });

                return NotFound(response);
            }

            return NoContent();
        }
    }
}
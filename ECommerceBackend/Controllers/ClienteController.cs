using ECommerceBackend.DTOs.Cliente;

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

        [HttpPut("{id}/alterar-senha")]
        public async Task<IActionResult> AlterarSenha(Guid id, AlterarSenhaDto dto)
        {
            await _service.AlterarSenha(id, dto);
            
            return Ok(new Response<object>
            {
                Message = "Senha alterada com sucesso."
            });
        }
        
        [HttpPut("{id}/ativar")]
        public async Task<IActionResult> AtivarCliente(Guid id)
        {
            await _service.AtivarCliente(id);
            
            return Ok(new Response<object>
            {
                Message = "Cliente ativado com sucesso."
            });
        }

        [HttpPut("{id}/desativar")]
        public async Task<IActionResult> DesativarCliente(Guid id)
        {
            await _service.DesativarCliente(id);
            
            return Ok(new Response<object>
            {
                Message = "Cliente desativado com sucesso."
            });
        }





        #region CRUD
        [HttpGet]
        [ProducesResponseType(typeof(Response<IEnumerable<ClienteResponseDto>>), StatusCodes.Status200OK)]
        public async Task<ActionResult<Response<IEnumerable<ClienteResponseDto>>>> GetAll()
        {
            var clientes = await _service.GetAll();

            var response = new Response<IEnumerable<ClienteResponseDto>>
            {
                Dados = clientes
            };

            return Ok(response);
        }


        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Response<ClienteResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Response<ClienteResponseDto>>> GetById(Guid id)
        {
            var cliente = await _service.GetById(id);

            if (cliente == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Cliente não encontrado",
                    Detail = $"Nenhum cliente foi encontrado com o id {id}",
                    Status = StatusCodes.Status404NotFound
                });
            }

            var response = new Response<ClienteResponseDto>
            {
                Dados = cliente
            };

            return Ok(response);
        }


        [HttpPost]
        [ProducesResponseType(typeof(Response<ClienteResponseDto>), StatusCodes.Status201Created)]
        public async Task<ActionResult<Response<ClienteResponseDto>>> Create(ClienteCreateDto dto)
        {
            var cliente = await _service.Create(dto);

            var response = new Response<ClienteResponseDto>
            {
                Dados = cliente
            };


            return CreatedAtAction(
                nameof(GetById),
                new { id = cliente.IdCliente },
                response);
        }



        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Update(Guid id, ClienteUpdateDto dto)
        {
            await _service.Update(id, dto);

            return Ok(new Response<object>
            {
                Message = "Cliente Atualizado com sucesso."
            });
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _service.Delete(id);

            return Ok(new Response<object>
            {
                Message = "Cliente removido com sucesso."
            });
        }


        [HttpGet("filtro")]
        public async Task<ActionResult<Response<IEnumerable<ClienteResponseDto>>>>GetByFilter([FromQuery] ClienteFiltroDto filtro)
        {
            var clientes = await _service.GetByFilter(filtro);

            return Ok(new Response<IEnumerable<ClienteResponseDto>>
            {
                Dados = clientes
            });
        }

        [HttpGet("search")]
        public async Task<ActionResult<Response<IEnumerable<ClienteResponseDto>>>>GetBySearch([FromQuery] string termo)
        {
            var clientes = await _service.GetBySearch(termo);

            return Ok(new Response<IEnumerable<ClienteResponseDto>>
            {
                Dados = clientes
            });
        }

        #endregion
    }
}
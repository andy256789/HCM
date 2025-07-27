using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HCM.Core.DTOs;
using HCM.Core.Interfaces;
using HCM.Core.Entities;
using System.Security.Claims;

namespace HCM.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmployeesController : ControllerBase
{
    private readonly IEmployeeService _employeeService;

    public EmployeesController(IEmployeeService employeeService)
    {
        _employeeService = employeeService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetAllEmployees()
    {
        try
        {
            var userRole = GetUserRole();
            var employees = await _employeeService.GetAllAsync();

            // Filter based on user role
            if (userRole == UserRole.Employee)
            {
                var employeeId = GetEmployeeId();
                if (employeeId.HasValue)
                {
                    employees = employees.Where(e => e.Id == employeeId.Value);
                }
                else
                {
                    return Forbid("Employee role requires valid employee ID");
                }
            }

            return Ok(employees);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EmployeeDto>> GetEmployee(int id)
    {
        try
        {
            var userRole = GetUserRole();
            var employeeId = GetEmployeeId();

            // Check authorization
            if (userRole == UserRole.Employee && employeeId != id)
            {
                return Forbid("You can only view your own employee record");
            }

            var employee = await _employeeService.GetByIdAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            return Ok(employee);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", error = ex.Message });
        }
    }

    [HttpPost]
    [Authorize(Roles = "HrAdmin,Manager")]
    public async Task<ActionResult<EmployeeDto>> CreateEmployee([FromBody] CreateEmployeeDto createDto)
    {
        try
        {
            var employee = await _employeeService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "HrAdmin,Manager")]
    public async Task<ActionResult<EmployeeDto>> UpdateEmployee(int id, [FromBody] UpdateEmployeeDto updateDto)
    {
        try
        {
            updateDto.Id = id;
            var employee = await _employeeService.UpdateAsync(id, updateDto);
            if (employee == null)
            {
                return NotFound();
            }

            return Ok(employee);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "HrAdmin")]
    public async Task<ActionResult> DeleteEmployee(int id)
    {
        try
        {
            var result = await _employeeService.DeleteAsync(id);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", error = ex.Message });
        }
    }

    [HttpGet("department/{departmentId}")]
    public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetEmployeesByDepartment(int departmentId)
    {
        try
        {
            var employees = await _employeeService.GetByDepartmentAsync(departmentId);
            return Ok(employees);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", error = ex.Message });
        }
    }

    private UserRole GetUserRole()
    {
        var roleString = User.FindFirst(ClaimTypes.Role)?.Value;
        return Enum.TryParse<UserRole>(roleString, out var role) ? role : UserRole.Employee;
    }

    private int? GetEmployeeId()
    {
        var employeeIdString = User.FindFirst("EmployeeId")?.Value;
        return int.TryParse(employeeIdString, out var employeeId) ? employeeId : null;
    }
}

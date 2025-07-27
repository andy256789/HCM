using Microsoft.EntityFrameworkCore;
using HCM.Core.DTOs;
using HCM.Core.Entities;
using HCM.Core.Interfaces;
using HCM.Infrastructure.Data;

namespace HCM.Infrastructure.Services;

public class DepartmentService : IDepartmentService
{
    private readonly HcmDbContext _context;

    public DepartmentService(HcmDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<DepartmentDto>> GetAllAsync()
    {
        return await _context.Departments
            .Include(d => d.Employees)
            .Include(d => d.Manager)
            .Select(d => new DepartmentDto
            {
                Id = d.Id,
                Name = d.Name,
                Description = d.Description,
                ManagerId = d.ManagerId,
                ManagerName = d.Manager != null ? $"{d.Manager.FirstName} {d.Manager.LastName}" : null,
                EmployeeCount = d.Employees.Count,
                CreatedAt = d.CreatedAt,
                UpdatedAt = d.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<DepartmentDto?> GetByIdAsync(int id)
    {
        var department = await _context.Departments
            .Include(d => d.Employees)
            .Include(d => d.Manager)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (department == null) return null;

        return new DepartmentDto
        {
            Id = department.Id,
            Name = department.Name,
            Description = department.Description,
            ManagerId = department.ManagerId,
            ManagerName = department.Manager != null ? $"{department.Manager.FirstName} {department.Manager.LastName}" : null,
            EmployeeCount = department.Employees.Count,
            CreatedAt = department.CreatedAt,
            UpdatedAt = department.UpdatedAt
        };
    }

    public async Task<DepartmentDto> CreateAsync(CreateDepartmentDto dto)
    {
        var department = new Department
        {
            Name = dto.Name,
            Description = dto.Description,
            ManagerId = dto.ManagerId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Departments.Add(department);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(department.Id) ?? throw new InvalidOperationException("Failed to create department");
    }

    public async Task<DepartmentDto?> UpdateAsync(int id, UpdateDepartmentDto dto)
    {
        var department = await _context.Departments.FindAsync(id);
        if (department == null) return null;

        department.Name = dto.Name;
        department.Description = dto.Description;
        department.ManagerId = dto.ManagerId;
        department.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var department = await _context.Departments.FindAsync(id);
        if (department == null) return false;

        // Check if department has employees
        var hasEmployees = await _context.Employees.AnyAsync(e => e.DepartmentId == id);
        if (hasEmployees)
        {
            throw new InvalidOperationException("Cannot delete department with employees");
        }

        _context.Departments.Remove(department);
        await _context.SaveChangesAsync();
        return true;
    }
}

using Microsoft.EntityFrameworkCore;
using HCM.Core.Entities;

namespace HCM.Infrastructure.Data;

public class HcmDbContext : DbContext
{
    public HcmDbContext(DbContextOptions<HcmDbContext> options) : base(options)
    {
    }

    public DbSet<Employee> Employees { get; set; }
    public DbSet<Department> Departments { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Employee configuration
        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.JobTitle).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Salary).HasColumnType("decimal(18,2)");
            entity.HasIndex(e => e.Email).IsUnique();
            
            entity.HasOne(e => e.Department)
                .WithMany(d => d.Employees)
                .HasForeignKey(e => e.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Department configuration
        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(d => d.Id);
            entity.Property(d => d.Name).IsRequired().HasMaxLength(100);
            entity.Property(d => d.Description).HasMaxLength(500);
            entity.HasIndex(d => d.Name).IsUnique();
        });

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(100);
            entity.Property(u => u.PasswordHash).IsRequired();
            entity.Property(u => u.Role).HasConversion<int>();
            entity.HasIndex(u => u.Email).IsUnique();
            
            entity.HasOne(u => u.Employee)
                .WithOne(e => e.User)
                .HasForeignKey<User>(u => u.EmployeeId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Seed data
        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        // Seed departments
        modelBuilder.Entity<Department>().HasData(
            new Department { Id = 1, Name = "Human Resources", Description = "HR Department", CreatedAt = DateTime.UtcNow },
            new Department { Id = 2, Name = "Engineering", Description = "Software Development", CreatedAt = DateTime.UtcNow },
            new Department { Id = 3, Name = "Sales", Description = "Sales and Marketing", CreatedAt = DateTime.UtcNow },
            new Department { Id = 4, Name = "Finance", Description = "Financial Operations", CreatedAt = DateTime.UtcNow }
        );

        // Seed employees
        modelBuilder.Entity<Employee>().HasData(
            new Employee { Id = 1, FirstName = "John", LastName = "Doe", Email = "john.doe@company.com", JobTitle = "HR Manager", Salary = 75000, DepartmentId = 1, CreatedAt = DateTime.UtcNow },
            new Employee { Id = 2, FirstName = "Jane", LastName = "Smith", Email = "jane.smith@company.com", JobTitle = "Senior Developer", Salary = 95000, DepartmentId = 2, CreatedAt = DateTime.UtcNow },
            new Employee { Id = 3, FirstName = "Mike", LastName = "Johnson", Email = "mike.johnson@company.com", JobTitle = "Sales Representative", Salary = 55000, DepartmentId = 3, CreatedAt = DateTime.UtcNow }
        );

        // Seed users (password is "password123" hashed with BCrypt)
        var passwordHash = BCrypt.Net.BCrypt.HashPassword("password123");
        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, Email = "admin@company.com", PasswordHash = passwordHash, Role = UserRole.HrAdmin, IsActive = true, CreatedAt = DateTime.UtcNow },
            new User { Id = 2, Email = "john.doe@company.com", PasswordHash = passwordHash, Role = UserRole.Manager, EmployeeId = 1, IsActive = true, CreatedAt = DateTime.UtcNow },
            new User { Id = 3, Email = "jane.smith@company.com", PasswordHash = passwordHash, Role = UserRole.Employee, EmployeeId = 2, IsActive = true, CreatedAt = DateTime.UtcNow }
        );
    }
}

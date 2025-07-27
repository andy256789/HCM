using System.ComponentModel.DataAnnotations;

namespace HCM.Core.Entities;

public class User
{
    public int Id { get; set; }
    
    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string PasswordHash { get; set; } = string.Empty;
    
    [Required]
    public UserRole Role { get; set; }
    
    public int? EmployeeId { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public bool IsActive { get; set; } = true;
    
    // Navigation properties
    public virtual Employee? Employee { get; set; }
}

public enum UserRole
{
    Employee = 1,
    Manager = 2,
    HrAdmin = 3
}

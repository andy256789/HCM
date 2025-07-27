using System.ComponentModel.DataAnnotations;

namespace HCM.Core.Entities;

public class Employee
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(50)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [StringLength(50)]
    public string LastName { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string JobTitle { get; set; } = string.Empty;
    
    [Range(0, double.MaxValue)]
    public decimal Salary { get; set; }
    
    public int DepartmentId { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    public virtual Department Department { get; set; } = null!;
    public virtual User? User { get; set; }
    public virtual ICollection<SalaryHistory> SalaryHistory { get; set; } = new List<SalaryHistory>();
    
    // Computed property
    public string FullName => $"{FirstName} {LastName}";
}

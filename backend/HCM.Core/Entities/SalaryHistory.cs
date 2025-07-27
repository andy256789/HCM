using System.ComponentModel.DataAnnotations;

namespace HCM.Core.Entities;

public class SalaryHistory
{
    public int Id { get; set; }
    
    [Required]
    public int EmployeeId { get; set; }
    
    [Required]
    [Range(0, double.MaxValue)]
    public decimal PreviousSalary { get; set; }
    
    [Required]
    [Range(0, double.MaxValue)]
    public decimal NewSalary { get; set; }
    
    [StringLength(500)]
    public string? Reason { get; set; }
    
    public DateTime EffectiveDate { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public int? CreatedByUserId { get; set; }
    
    // Navigation properties
    public virtual Employee Employee { get; set; } = null!;
    public virtual User? CreatedBy { get; set; }
}

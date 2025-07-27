using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HCM.Core.DTOs;
using HCM.Core.Entities;
using HCM.Core.Interfaces;
using HCM.Infrastructure.Data;

namespace HCM.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly HcmDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(HcmDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _context.Users
            .Include(u => u.Employee)
            .ThenInclude(e => e!.Department)
            .FirstOrDefaultAsync(u => u.Email == dto.Email && u.IsActive);

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            return null;
        }

        // Update last login
        user.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var userDto = MapToUserDto(user);
        var token = GenerateJwtToken(userDto);

        return new AuthResponseDto
        {
            Token = token,
            Expires = DateTime.UtcNow.AddHours(24),
            User = userDto
        };
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        // Check if user already exists
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("User with this email already exists");
        }

        // Validate employee if provided
        if (dto.EmployeeId.HasValue)
        {
            var employee = await _context.Employees.FindAsync(dto.EmployeeId.Value);
            if (employee == null)
            {
                throw new InvalidOperationException("Employee not found");
            }

            // Check if employee already has a user
            var existingEmployeeUser = await _context.Users.FirstOrDefaultAsync(u => u.EmployeeId == dto.EmployeeId);
            if (existingEmployeeUser != null)
            {
                throw new InvalidOperationException("Employee already has a user account");
            }
        }

        var user = new User
        {
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = dto.Role,
            EmployeeId = dto.EmployeeId,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Reload user with employee data
        var createdUser = await _context.Users
            .Include(u => u.Employee)
            .ThenInclude(e => e!.Department)
            .FirstAsync(u => u.Id == user.Id);

        var userDto = MapToUserDto(createdUser);
        var token = GenerateJwtToken(userDto);

        return new AuthResponseDto
        {
            Token = token,
            Expires = DateTime.UtcNow.AddHours(24),
            User = userDto
        };
    }

    public async Task<UserDto?> GetCurrentUserAsync(string email)
    {
        var user = await _context.Users
            .Include(u => u.Employee)
            .ThenInclude(e => e!.Department)
            .FirstOrDefaultAsync(u => u.Email == email && u.IsActive);

        return user == null ? null : MapToUserDto(user);
    }

    public bool ValidateToken(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:SecretKey"] ?? "your-secret-key-here");

            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            return true;
        }
        catch
        {
            return false;
        }
    }

    public string GenerateJwtToken(UserDto user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:SecretKey"] ?? "your-secret-key-here-must-be-at-least-32-characters");

        var claims = new List<Claim>
        {
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Role, user.Role.ToString())
        };

        if (user.EmployeeId.HasValue)
        {
            claims.Add(new Claim("EmployeeId", user.EmployeeId.Value.ToString()));
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(24),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private static UserDto MapToUserDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            Role = user.Role,
            RoleName = user.Role.ToString(),
            EmployeeId = user.EmployeeId,
            EmployeeName = user.Employee?.FullName,
            CreatedAt = user.CreatedAt,
            LastLoginAt = user.LastLoginAt,
            IsActive = user.IsActive
        };
    }
}

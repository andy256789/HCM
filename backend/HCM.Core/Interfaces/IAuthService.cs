using HCM.Core.DTOs;

namespace HCM.Core.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto?> LoginAsync(LoginDto dto);
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<UserDto?> GetCurrentUserAsync(string email);
    Task<bool> ValidateTokenAsync(string token);
    string GenerateJwtToken(UserDto user);
}

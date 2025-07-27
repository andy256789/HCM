{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    # .NET SDK
    dotnet-sdk_8

    # Node.js and npm for Angular
    nodejs_20
    nodePackages.npm
    nodePackages."@angular/cli"

    # Database tools
    postgresql
    sqlite

    # Development tools
    git
    curl
    jq
    
    # Docker for containerization (optional enhancement)
    docker
    docker-compose

    # Additional tools
    openssl
  ];


  # Environment variables
  DOTNET_ROOT = "${pkgs.dotnet-sdk_8}";
  DOTNET_CLI_TELEMETRY_OPTOUT = "1";
}

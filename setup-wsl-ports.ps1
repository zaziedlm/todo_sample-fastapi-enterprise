# WSL2 Port Forwarding Setup
# Run this PowerShell script as Administrator on Windows

$wslIP = wsl hostname -I
$wslIP = $wslIP.Trim()

# Remove existing port proxies
netsh interface portproxy delete v4tov4 listenport=8000
netsh interface portproxy delete v4tov4 listenport=3000

# Add new port proxies
netsh interface portproxy add v4tov4 listenport=8000 listenaddress=0.0.0.0 connectport=8000 connectaddress=$wslIP
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=$wslIP

Write-Host "Port forwarding setup complete for WSL IP: $wslIP"
Write-Host "Backend: http://localhost:8000"
Write-Host "Frontend: http://localhost:3000"

# Show current port proxies
netsh interface portproxy show all
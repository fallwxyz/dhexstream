Add-Type -AssemblyName System.IO.Compression.FileSystem

function List-Zip {
    param($path)
    if (Test-Path $path) {
        Write-Host "--- CONTENTS OF $path ---"
        try {
            [System.IO.Compression.ZipFile]::OpenRead($path).Entries | Select-Object -First 20 FullName
        } catch {
            Write-Host "Error reading zip: $_"
        }
    } else {
        Write-Host "File not found: $path"
    }
}

List-Zip 'd:\SQL XAMPP\htdocs\dhexstream\frontend.zip'
List-Zip 'd:\SQL XAMPP\htdocs\dhexstream\backend.zip'

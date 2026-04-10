param(
  [string]$SourceIcon = "build/icons/1024x1024.png",
  [string]$OutputDir = "build/appx"
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path $SourceIcon)) {
  throw "Source icon not found: $SourceIcon"
}

if (-not (Test-Path $OutputDir)) {
  New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

function New-SquarePng {
  param(
    [string]$Source,
    [string]$OutPath,
    [int]$PixelSize,
    [System.Drawing.Color]$BgColor
  )

  $sizeValue = [int]$PixelSize
  $bmp = New-Object System.Drawing.Bitmap($sizeValue, $sizeValue)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear($BgColor)

  $img = [System.Drawing.Image]::FromFile($Source)
  $pad = [int]([Math]::Round($sizeValue * 0.12))
  $innerSize = [int]($sizeValue - ($pad * 2))
  if ($innerSize -lt 1) {
    $innerSize = 1
  }
  $rect = [System.Drawing.Rectangle]::new($pad, $pad, $innerSize, $innerSize)
  $g.DrawImage($img, $rect)

  $img.Dispose()
  $g.Dispose()
  $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

function New-WidePng {
  param(
    [string]$Source,
    [string]$OutPath,
    [int]$Width,
    [int]$Height,
    [System.Drawing.Color]$BgColor
  )

  $widthValue = [int]$Width
  $heightValue = [int]$Height
  $bmp = New-Object System.Drawing.Bitmap($widthValue, $heightValue)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear($BgColor)

  $img = [System.Drawing.Image]::FromFile($Source)
  $size = [int]([Math]::Min($widthValue, $heightValue) * 0.74)
  $x = [int](($widthValue - $size) / 2)
  $y = [int](($heightValue - $size) / 2)
  $rect = New-Object System.Drawing.Rectangle($x, $y, $size, $size)
  $g.DrawImage($img, $rect)

  $img.Dispose()
  $g.Dispose()
  $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

$bg = [System.Drawing.Color]::FromArgb(255, 10, 14, 23)

New-SquarePng -Source $SourceIcon -OutPath (Join-Path $OutputDir "StoreLogo.png") -PixelSize 50 -BgColor $bg
New-SquarePng -Source $SourceIcon -OutPath (Join-Path $OutputDir "Square44x44Logo.png") -PixelSize 44 -BgColor $bg
New-SquarePng -Source $SourceIcon -OutPath (Join-Path $OutputDir "Square150x150Logo.png") -PixelSize 150 -BgColor $bg
New-WidePng -Source $SourceIcon -OutPath (Join-Path $OutputDir "Wide310x150Logo.png") -Width 310 -Height 150 -BgColor $bg

# Optional but recommended assets
New-SquarePng -Source $SourceIcon -OutPath (Join-Path $OutputDir "LargeTile.png") -PixelSize 310 -BgColor $bg
New-SquarePng -Source $SourceIcon -OutPath (Join-Path $OutputDir "SmallTile.png") -PixelSize 71 -BgColor $bg
New-WidePng -Source $SourceIcon -OutPath (Join-Path $OutputDir "SplashScreen.png") -Width 620 -Height 300 -BgColor $bg

Write-Host "Generated AppX assets in $OutputDir"

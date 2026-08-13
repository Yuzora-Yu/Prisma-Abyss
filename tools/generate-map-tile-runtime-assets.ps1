param(
    [Parameter(Mandatory = $true)]
    [string]$SourceDirectory,

    [Parameter(Mandatory = $true)]
    [string]$OutputDirectory
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$sourceRoot = (Resolve-Path -LiteralPath $SourceDirectory).Path
New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
$outputRoot = (Resolve-Path -LiteralPath $OutputDirectory).Path

$generated = foreach ($file in Get-ChildItem -LiteralPath $sourceRoot -File -Filter '*.png' | Sort-Object Name) {
    $sourceImage = [System.Drawing.Image]::FromFile($file.FullName)
    try {
        $targetWidth = 32
        $targetHeight = if ($file.BaseName -match 'wall') { 48 } else { 32 }
        # Native 32x32 and 32x48 chips are already cheap to decode. Only derive
        # assets whose source dimensions exceed the renderer's tile envelope.
        if ($sourceImage.Width -le 32 -and $sourceImage.Height -le 48) {
            continue
        }

        $destinationPath = Join-Path $outputRoot $file.Name
        $bitmap = New-Object System.Drawing.Bitmap(
            $targetWidth,
            $targetHeight,
            [System.Drawing.Imaging.PixelFormat]::Format32bppPArgb
        )
        try {
            $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
            try {
                $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
                # Phaser runs this field renderer with pixelArt=true and
                # antialias=false. Pre-scale with the same nearest-neighbour
                # policy so the runtime image remains visually equivalent.
                $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighSpeed
                $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
                $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
                $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None

                $attributes = New-Object System.Drawing.Imaging.ImageAttributes
                try {
                    $attributes.SetWrapMode([System.Drawing.Drawing2D.WrapMode]::TileFlipXY)
                    $destinationRect = New-Object System.Drawing.Rectangle(0, 0, $targetWidth, $targetHeight)
                    $graphics.DrawImage(
                        $sourceImage,
                        $destinationRect,
                        0,
                        0,
                        $sourceImage.Width,
                        $sourceImage.Height,
                        [System.Drawing.GraphicsUnit]::Pixel,
                        $attributes
                    )
                } finally {
                    $attributes.Dispose()
                }
            } finally {
                $graphics.Dispose()
            }

            $bitmap.Save($destinationPath, [System.Drawing.Imaging.ImageFormat]::Png)
        } finally {
            $bitmap.Dispose()
        }

        $outputFile = Get-Item -LiteralPath $destinationPath
        [pscustomobject]@{
            Name = $file.Name
            SourceWidth = $sourceImage.Width
            SourceHeight = $sourceImage.Height
            TargetWidth = $targetWidth
            TargetHeight = $targetHeight
            SourceBytes = $file.Length
            TargetBytes = $outputFile.Length
        }
    } finally {
        $sourceImage.Dispose()
    }
}

$generated | ConvertTo-Json -Depth 3

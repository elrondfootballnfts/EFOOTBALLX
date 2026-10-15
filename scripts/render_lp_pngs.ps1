Add-Type -AssemblyName System.Drawing

function Render-LpLogo {
    param (
        [string]$Type, # 'WEGLD' or 'USDC'
        [string]$OutPath
    )

    $bmp = [System.Drawing.Bitmap]::new(200, 200, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.Clear([System.Drawing.Color]::Transparent)

    # 1. Outer Dark Disc (cx=100, cy=100, r=96)
    $discPath = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $discPath.AddEllipse(4, 4, 192, 192)
    
    $pbg = [System.Drawing.Drawing2D.PathGradientBrush]::new($discPath)
    $pbg.CenterPoint = [System.Drawing.PointF]::new(100.0, 80.0)
    $pbg.CenterColor = [System.Drawing.Color]::FromArgb(255, 14, 30, 42)
    $pbg.SurroundColors = @([System.Drawing.Color]::FromArgb(255, 4, 8, 13))
    $g.FillPath($pbg, $discPath)

    # 2. Outer Rim Border Gradient
    $pt1 = [System.Drawing.PointF]::new(0.0, 0.0)
    $pt2 = [System.Drawing.PointF]::new(200.0, 200.0)
    $col1 = [System.Drawing.Color]::FromArgb(255, 168, 255, 0)
    $col2 = if ($Type -eq 'WEGLD') { [System.Drawing.Color]::FromArgb(255, 35, 247, 221) } else { [System.Drawing.Color]::FromArgb(255, 39, 117, 202) }
    $rimBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new($pt1, $pt2, $col1, $col2)
    $rimPen = [System.Drawing.Pen]::new($rimBrush, 3.0)
    $g.DrawEllipse($rimPen, 4, 4, 192, 192)

    # Subtle inner ring
    $innerPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(35, 255, 255, 255), 1.0)
    $g.DrawEllipse($innerPen, 8, 8, 184, 184)

    # 3. Left Coin: EFOO Rocket Football (cx=72, cy=94, r=44)
    $leftBgBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 6, 19, 12))
    $g.FillEllipse($leftBgBrush, 28, 50, 88, 88)
    
    # Draw EFOO Crest image clipped to circle
    $efooImgPath = Join-Path $PSScriptRoot "..\branding\rebranded\efoo-degen-crest-200x200.png"
    if (Test-Path $efooImgPath) {
        $efooImg = [System.Drawing.Image]::FromFile((Resolve-Path $efooImgPath))
        $oldClip = $g.Clip
        $coinClip = [System.Drawing.Drawing2D.GraphicsPath]::new()
        $coinClip.AddEllipse(29, 51, 86, 86)
        $g.SetClip($coinClip, [System.Drawing.Drawing2D.CombineMode]::Replace)
        $g.DrawImage($efooImg, 29, 51, 86, 86)
        $g.Clip = $oldClip
        $efooImg.Dispose()
    }
    # Left coin neon rim
    $leftRimPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 168, 255, 0), 2.5)
    $g.DrawEllipse($leftRimPen, 28, 50, 88, 88)

    # 4. Right Coin (cx=128, cy=106, r=44)
    # Cutout shadow/ring
    $shadowPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 4, 8, 13), 6.0)
    $g.DrawEllipse($shadowPen, 84, 62, 88, 88)

    if ($Type -eq 'WEGLD') {
        # MultiversX / WEGLD Coin
        $wegldBgBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 0, 0, 0))
        $g.FillEllipse($wegldBgBrush, 85, 63, 86, 86)

        # Subtle inner cyan glow ring
        $glowPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(60, 35, 247, 221), 1.5)
        $g.DrawEllipse($glowPen, 88, 66, 80, 80)

        # Cyan border
        $wegldBorderPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 35, 247, 221), 2.5)
        $g.DrawEllipse($wegldBorderPen, 85, 63, 86, 86)

        # Draw MultiversX <X> polygon
        $mvxBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 35, 247, 221))
        $pts = @(
            [System.Drawing.PointF]::new([float](128 + (1313-1250)*0.046), [float](106 + (1250-1250)*0.046)),
            [System.Drawing.PointF]::new([float](128 + (1840-1250)*0.046), [float](106 + (975-1250)*0.046)),
            [System.Drawing.PointF]::new([float](128 + (1752-1250)*0.046), [float](106 + (810-1250)*0.046)),
            [System.Drawing.PointF]::new([float](128 + (1269-1250)*0.046), [float](106 + (1002-1250)*0.046)),
            [System.Drawing.PointF]::new([float](128 + (1231-1250)*0.046), [float](106 + (1002-1250)*0.046)),
            [System.Drawing.PointF]::new([float](128 + (748-1250)*0.046),  [float](106 + (810-1250)*0.046)),
            [System.Drawing.PointF]::new([float](128 + (660-1250)*0.046),  [float](106 + (975-1250)*0.046)),
            [System.Drawing.PointF]::new([float](128 + (1187-1250)*0.046), [float](106 + (1250-1250)*0.046)),
            [System.Drawing.PointF]::new([float](128 + (660-1250)*0.046),  [float](106 + (1525-1250)*0.046)),
            [System.Drawing.PointF]::new([float](128 + (748-1250)*0.046),  [float](106 + (1690-1250)*0.046)),
            [System.Drawing.PointF]::new([float](128 + (1231-1250)*0.046), [float](106 + (1498-1250)*0.046)),
            [System.Drawing.PointF]::new([float](128 + (1269-1250)*0.046), [float](106 + (1498-1250)*0.046)),
            [System.Drawing.PointF]::new([float](128 + (1752-1250)*0.046), [float](106 + (1690-1250)*0.046)),
            [System.Drawing.PointF]::new([float](128 + (1840-1250)*0.046), [float](106 + (1525-1250)*0.046))
        )
        $g.FillPolygon($mvxBrush, $pts)

    } else {
        # USDC Coin
        $usdcBgBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 39, 117, 202))
        $g.FillEllipse($usdcBgBrush, 85, 63, 86, 86)

        $usdcBorderPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 93, 162, 236), 2.0)
        $g.DrawEllipse($usdcBorderPen, 85, 63, 86, 86)

        # Concentric White Arcs
        $arcPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 255, 255, 255), 2.8)
        $g.DrawArc($arcPen, 93, 71, 70, 70, 105.0, 150.0)
        $g.DrawArc($arcPen, 93, 71, 70, 70, 285.0, 150.0)

        # Center '$' Symbol
        $fontFamily = [System.Drawing.FontFamily]::GenericSansSerif
        $font = [System.Drawing.Font]::new($fontFamily, 26.0, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
        $sf = [System.Drawing.StringFormat]::new()
        $sf.Alignment = [System.Drawing.StringAlignment]::Center
        $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
        $whiteBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
        $g.DrawString("$", $font, $whiteBrush, [float]128.0, [float]106.0, $sf)
    }

    # 5. Bottom LP Pill Badge (x=36, y=156, w=128, h=25)
    $pillPath = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $pillPath.AddArc(36, 156, 24, 24, 90, 180)
    $pillPath.AddArc(140, 156, 24, 24, 270, 180)
    $pillPath.CloseFigure()

    $pillBgBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(240, 6, 12, 20))
    $g.FillPath($pillBgBrush, $pillPath)

    $pillBorderPen = [System.Drawing.Pen]::new($rimBrush, 1.5)
    $g.DrawPath($pillBorderPen, $pillPath)

    # Pill Text
    $pillText = if ($Type -eq 'WEGLD') { "EFOO / WEGLD LP" } else { "EFOO / USDC LP" }
    $pillFontFamily = [System.Drawing.FontFamily]::GenericSansSerif
    $pillFont = [System.Drawing.Font]::new($pillFontFamily, 9.5, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $pillSf = [System.Drawing.StringFormat]::new()
    $pillSf.Alignment = [System.Drawing.StringAlignment]::Center
    $pillSf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $pillTextBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
    $g.DrawString($pillText, $pillFont, $pillTextBrush, [float]100.0, [float]168.0, $pillSf)

    $g.Dispose()
    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Output "Successfully rendered $OutPath"
}

$wegldOut = Join-Path $PSScriptRoot "..\branding\rebranded\efoo-wegld-lp-200x200.png"
$usdcOut = Join-Path $PSScriptRoot "..\branding\rebranded\efoo-usdc-lp-200x200.png"

Render-LpLogo -Type 'WEGLD' -OutPath $wegldOut
Render-LpLogo -Type 'USDC' -OutPath $usdcOut

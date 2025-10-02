# Certificate Logo Configuration

This folder contains logo files that will be displayed on generated certificates.

## Required Files

### 1. nobg_logo.png
- **Position**: Top-left corner of certificate
- **Purpose**: Represents your website/company logo
- **Size**: 80x80 pixels (auto-resized from source)
- **Format**: PNG (recommended for transparency)
- **Location**: `img_logo_pdf/nobg_logo.png`

### 2. badge-logo.png (Optional)
- **Position**: Top-right corner of certificate  
- **Purpose**: Fallback badge logo when assessment doesn't have a specific badge template
- **Size**: 50x50 pixels (recommended)
- **Format**: PNG (recommended for transparency)
- **Location**: `img_logo_pdf/badge-logo.png`

## How It Works

1. **Website Logo**: Always displayed in top-left corner if `website-logo.png` exists
2. **Badge Logo**: 
   - If assessment has a badge template with icon → uses that icon
   - If no badge template → uses `badge-logo.png` as fallback
   - If neither exists → no badge logo displayed

## Logo Specifications

- **Website Logo**: 80x80 pixels (will be resized automatically)
- **Badge Logo**: 50x50 pixels (will be resized automatically)
- **Format**: PNG, JPG, JPEG supported
- **Background**: Transparent PNG recommended for best appearance
- **Quality**: High resolution for crisp PDF output

## Example Certificate Layout

```
[Website Logo]                    [Badge Logo]
              WORKOO JOB BOARD
         CERTIFICATE OF ACHIEVEMENT
              
              Certificate content...
```

## Adding Your Logos

1. Place your website logo as `nobg_logo.png`
2. (Optional) Place fallback badge logo as `badge-logo.png`
3. Restart the application to apply changes
4. Generate a new certificate to see the logos

## Troubleshooting

- **Logo not showing**: Check file exists and has correct name
- **Logo too big/small**: Logos are automatically resized to 50x50px
- **Poor quality**: Use high-resolution source images
- **Transparency issues**: Use PNG format for transparent backgrounds

## Notes

- Logos are cached by the PDF generation system
- Changes require application restart
- Badge icons from assessment templates take priority over fallback badge logo
- If files don't exist, certificates will generate without logos (no errors)

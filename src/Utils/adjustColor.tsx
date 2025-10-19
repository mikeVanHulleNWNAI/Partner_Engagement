
/**
 * Adjusts the brightness of a hex color
 * @param hex - Color in format #000000 or #000
 * @param percent - Percentage to adjust (-100 to 100)
 *                  Positive values make it lighter, negative values make it darker
 * @returns Adjusted color in format #000000
 * 
 * @example
 * adjustColor('#ff0000', 20)   // Returns '#ff3333' (lighter red)
 * adjustColor('#ff0000', -20)  // Returns '#cc0000' (darker red)
 * adjustColor('#3498db', 50)   // Returns '#9acced' (lighter blue)
 */
export function adjustColor(hex: string, percent: number): string {
  // Remove the # if present
  hex = hex.replace('#', '');
  
  // Convert 3-digit hex to 6-digit
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  // Validate hex format
  if (hex.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(hex)) {
    throw new Error('Invalid hex color format. Use #000000 or #000');
  }
  
  // Clamp percent between -100 and 100
  percent = Math.max(-100, Math.min(100, percent));
  
  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Adjust each channel
  const adjust = (channel: number): number => {
    if (percent > 0) {
      // Lighten: move towards 255
      return Math.round(channel + (255 - channel) * (percent / 100));
    } else {
      // Darken: move towards 0
      return Math.round(channel * (1 + percent / 100));
    }
  };
  
  const newR = adjust(r);
  const newG = adjust(g);
  const newB = adjust(b);
  
  // Convert back to hex
  const toHex = (n: number): string => {
    const hex = Math.max(0, Math.min(255, n)).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

/**
 * Adjusts the lightness of a hex color using HSL color space
 * @param hex - Color in format #000000 or #000
 * @param percent - Percentage to adjust (-100 to 100)
 * @returns Adjusted color in format #000000
 */
export function adjustColorHSL(hex: string, percent: number): string {
  // Remove the # if present
  hex = hex.replace('#', '');
  
  // Convert 3-digit hex to 6-digit
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Convert RGB to HSL
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  // Adjust lightness
  l = Math.max(0, Math.min(1, l + (percent / 100)));
  
  // Convert HSL back to RGB
  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  let newR: number, newG: number, newB: number;
  
  if (s === 0) {
    newR = newG = newB = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    newR = hue2rgb(p, q, h + 1/3);
    newG = hue2rgb(p, q, h);
    newB = hue2rgb(p, q, h - 1/3);
  }
  
  // Convert to hex
  const toHex = (n: number): string => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

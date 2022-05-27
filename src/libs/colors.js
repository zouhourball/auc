export const getconctrast = (color) => {
  // If a leading # is provided, remove it
  if (color.slice(0, 1) === '#') {
    color = color.slice(1)
  }

  // If a three-character hexcode, make six-character
  if (color.length === 3) {
    color = color
      .split('')
      .map((hex) => hex + hex)
      .join('')
  }

  // Convert to RGB value
  var r = parseInt(color.substr(0, 2), 16)
  var g = parseInt(color.substr(2, 2), 16)
  var b = parseInt(color.substr(4, 2), 16)

  // Get YIQ ratio
  var yiq = (r * 299 + g * 587 + b * 114) / 1000

  // Check contrast
  return yiq >= 128 ? 'black' : 'white'
}

export const hexToRgb = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null
}

export const componentToHex = (c) => {
  var hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

export const rgbToHex = (r, g, b) => {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

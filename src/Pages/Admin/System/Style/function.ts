export const rgbaToHex = (color: string) => {
  //  check if it hex format then return
  if (color.includes("#")) {
    return color;
  }

  const rgba = color.replace("rgba(", "").replace(")", "").split(",");
  const r = parseInt(rgba[0]);
  const g = parseInt(rgba[1]);
  const b = parseInt(rgba[2]);
  const a = parseFloat(rgba[3]);
  const rgb = b | (g << 8) | (r << 16);
  return `#${(0x1000000 + rgb).toString(16).slice(1)} / ${a}%`;
};

// Clamp helper and color adjustment
export function applyColorChange(colorString, delta) {
  const [r, g, b] = colorString
    .split(",")
    .map((v) => Math.min(255, Math.max(0, parseInt(v.trim()) + delta)));
  return `${r}, ${g}, ${b}`;
}

export function applySpecificColorChange(colorString, rdelta, gdelta, bdelta) {
  const [r, g, b] = colorString
    .split(",")
    .map((v, i) =>
      Math.min(
        255,
        Math.max(
          0,
          parseInt(v.trim()) + (i === 0 ? rdelta : i === 1 ? gdelta : bdelta)
        )
      )
    );
  return `${r}, ${g}, ${b}`;
}

// Color base exports

export function getColors(_baseColor, _accentColor) {
  const baseColor = _baseColor;
  const accentColor = _accentColor;

  // Lighten/darken exports
  const lighterBaseColor = applyColorChange(baseColor, 20);
  const darkerBaseColor = applyColorChange(baseColor, -20);

  const lighterAccentColor = applyColorChange(accentColor, 20);
  const darkerAccentColor = applyColorChange(accentColor, -20);

  // Button states: base / hover / click (lighter or darker adjustments)
  const baseButtonColor = applyColorChange(baseColor, -15);
  const hoverBaseButtonColor = applyColorChange(baseButtonColor, 10);
  const clickBaseButtonColor = applyColorChange(baseButtonColor, -10);

  const accentButtonColor = applyColorChange(accentColor, -15);
  const hoverAccentButtonColor = applyColorChange(accentButtonColor, 10);
  const clickAccentButtonColor = applyColorChange(accentButtonColor, -10);

  // Themed variants
  const baseThemedButtonColor = applyColorChange(baseColor, 35);
  const hoverBaseThemedButtonColor = applyColorChange(
    baseThemedButtonColor,
    10
  );
  const clickBaseThemedButtonColor = applyColorChange(
    baseThemedButtonColor,
    -10
  );

  const accentThemedButtonColor = applyColorChange(accentColor, -35);
  const hoverAccentThemedButtonColor = applyColorChange(
    accentThemedButtonColor,
    10
  );
  const clickAccentThemedButtonColor = applyColorChange(
    accentThemedButtonColor,
    -10
  );

  return {
    baseColor: baseColor,
    lighterBaseColor: lighterBaseColor,
    darkerBaseColor: darkerBaseColor,
    baseButtonColor: baseButtonColor,
    hoverBaseButtonColor: hoverBaseButtonColor,
    clickBaseButtonColor: clickBaseButtonColor,
    baseThemedButtonColor: baseThemedButtonColor,
    hoverBaseThemedButtonColor: hoverBaseThemedButtonColor,
    clickBaseThemedButtonColor: clickBaseThemedButtonColor,
    accentColor: accentColor,
    lighterAccentColor: lighterAccentColor,
    darkerAccentColor: darkerAccentColor,
    accentButtonColor: accentButtonColor,
    hoverAccentButtonColor: hoverAccentButtonColor,
    clickAccentButtonColor: clickAccentButtonColor,
    accentThemedButtonColor: accentThemedButtonColor,
    hoverAccentThemedButtonColor: hoverAccentThemedButtonColor,
    clickAccentThemedButtonColor: clickAccentThemedButtonColor,
  };
}

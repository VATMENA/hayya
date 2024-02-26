import colors from "tailwindcss/colors";

export function color(input: string): string {
  // input needs to be colorname-weight
  if (!input.includes("-")) {
    return "#000000";
  }
  let split = input.split("-");
  if (split.length != 2) {
    return "#000000";
  }

  let color = split[0];
  let weight = split[1];

  if (!Object.keys(colors).includes(color)) {
    return "#000000";
  }

  // @ts-ignore
  let weights = colors[color];

  if (!Object.keys(weights).includes(weight)) {
    return "#000000";
  }

  return weights[weight];
}
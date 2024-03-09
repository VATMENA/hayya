export enum C_TYP {
  Permanent = "PERM",
  Solo = "SOLO",
}
export enum P_TYP {
  SuperCenter = "SCTR",
  OpenSkies = "OSKY",
  Unrestricted = "AFUR",
  Tier1 = "AFT1",
  Tier2 = "AFT2",
  Specific = "AFSP",
  Enroute = "ENRT",
}
export enum POS {
  Delivery = "DEL",
  Ground = "GND",
  Tower = "TWR",
  Approach = "APP",
  Enroute = "CTR",
}
export interface PositionV2 {
  c_typ: C_TYP;
  p_typ: P_TYP;
  facility: string | null;
  position: POS | null;
}
export function validate_position_v2(pos: PositionV2): boolean {
  // SuperCenter & Enroute must not have a facility or position specified
  if (
    (pos.p_typ === P_TYP.SuperCenter || pos.p_typ === P_TYP.Enroute) &&
    (pos.facility !== null || pos.position !== null)
  ) {
    return false;
  }
  // OpenSkies & Unrestricted must have a position set and must not have a facility set
  if (
    (pos.p_typ === P_TYP.OpenSkies || pos.p_typ == P_TYP.Unrestricted) &&
    (pos.position === null || pos.facility !== null)
  ) {
    return false;
  }
  // T1 & T2 must have a position and facility set
  return !(
    (pos.p_typ === P_TYP.Tier1 ||
      pos.p_typ === P_TYP.Tier2 ||
      pos.p_typ === P_TYP.Specific) &&
    (pos.position === null || pos.facility === null)
  );
}
export function serialize_position_v2(pos: PositionV2): string | null {
  if (!validate_position_v2(pos)) return null;
  let base = `${pos.c_typ}-${pos.p_typ}`;
  if (pos.facility !== null) {
    base += `-${pos.facility}`;
  }
  if (pos.position !== null) {
    base += `-${pos.position}`;
  }
  return base;
}

function enumFromStringValue<T>(
  enm: { [s: string]: T },
  value: string,
): T | undefined {
  return (Object.values(enm) as unknown as string[]).includes(value)
    ? (value as unknown as T)
    : undefined;
}

export function parse_position_v2(input: string): PositionV2 | null {
  let split = input.split("-");
  if (split.length < 2) return null;
  let c_typ_str = split[0];
  let p_typ_str = split[1];

  const c_typ: C_TYP | undefined = enumFromStringValue(C_TYP, c_typ_str);
  if (c_typ === undefined) return null;

  const p_typ: P_TYP | undefined = enumFromStringValue(P_TYP, p_typ_str);
  if (p_typ === undefined) return null;

  // {SOLO,PERM}-{SCTR,ENRT}
  if (p_typ === P_TYP.SuperCenter || p_typ === P_TYP.Enroute) {
    return { c_typ, p_typ, facility: null, position: null };
  }
  // {SOLO,PERM}-{OSKY,AFUR}-{DEL,GND,TWR,APP}
  if (p_typ === P_TYP.OpenSkies || p_typ == P_TYP.Unrestricted) {
    // next token needs to be the position
    if (split.length < 3) return null;
    let pos_str = split[2];
    const pos: POS | undefined = enumFromStringValue(POS, pos_str);
    if (pos === undefined) return null;

    return { c_typ, p_typ, facility: null, position: pos };
  }
  // {SOLO,PERM}-{AFT1,AFT2}-ICAO-{DEL,GND,TWR,APP}
  if (
    p_typ === P_TYP.Tier1 ||
    p_typ === P_TYP.Tier2 ||
    p_typ === P_TYP.Specific
  ) {
    if (split.length < 4) return null;

    let facility_icao = split[2];

    let pos_str = split[3];
    const pos: POS | undefined = enumFromStringValue(POS, pos_str);
    if (pos === undefined) return null;

    return { c_typ, p_typ, facility: facility_icao, position: pos };
  }

  return null;
}

export const GRANDFATHER_CERTS_S1: PositionV2[] = [
  {
    c_typ: C_TYP.Permanent,
    p_typ: P_TYP.Unrestricted,
    facility: null,
    position: POS.Delivery,
  },
  {
    c_typ: C_TYP.Permanent,
    p_typ: P_TYP.Unrestricted,
    facility: null,
    position: POS.Ground,
  },
];
export const GRANDFATHER_CERTS_S2: PositionV2[] = [
  {
    c_typ: C_TYP.Permanent,
    p_typ: P_TYP.Unrestricted,
    facility: null,
    position: POS.Delivery,
  },
  {
    c_typ: C_TYP.Permanent,
    p_typ: P_TYP.Unrestricted,
    facility: null,
    position: POS.Ground,
  },
  {
    c_typ: C_TYP.Permanent,
    p_typ: P_TYP.Unrestricted,
    facility: null,
    position: POS.Tower,
  },
];
export const GRANDFATHER_CERTS_S3 = [
  {
    c_typ: C_TYP.Permanent,
    p_typ: P_TYP.Unrestricted,
    facility: null,
    position: POS.Delivery,
  },
  {
    c_typ: C_TYP.Permanent,
    p_typ: P_TYP.Unrestricted,
    facility: null,
    position: POS.Ground,
  },
  {
    c_typ: C_TYP.Permanent,
    p_typ: P_TYP.Unrestricted,
    facility: null,
    position: POS.Tower,
  },
  {
    c_typ: C_TYP.Permanent,
    p_typ: P_TYP.Unrestricted,
    facility: null,
    position: POS.Approach,
  },
];
export const GRANDFATHER_CERTS_C1 = [
  {
    c_typ: C_TYP.Permanent,
    p_typ: P_TYP.Unrestricted,
    facility: null,
    position: POS.Delivery,
  },
  {
    c_typ: C_TYP.Permanent,
    p_typ: P_TYP.Unrestricted,
    facility: null,
    position: POS.Ground,
  },
  {
    c_typ: C_TYP.Permanent,
    p_typ: P_TYP.Unrestricted,
    facility: null,
    position: POS.Tower,
  },
  {
    c_typ: C_TYP.Permanent,
    p_typ: P_TYP.Unrestricted,
    facility: null,
    position: POS.Approach,
  },
  {
    c_typ: C_TYP.Permanent,
    p_typ: P_TYP.Enroute,
    facility: null,
    position: null,
  },
];
export const GRANDFATHER_CERTS = {
  S1: GRANDFATHER_CERTS_S1,
  S2: GRANDFATHER_CERTS_S2,
  S3: GRANDFATHER_CERTS_S3,
  C1: GRANDFATHER_CERTS_C1,
  C2: GRANDFATHER_CERTS_C1,
  C3: GRANDFATHER_CERTS_C1,
  I1: GRANDFATHER_CERTS_C1,
  I2: GRANDFATHER_CERTS_C1,
  I3: GRANDFATHER_CERTS_C1,
  SUP: [],
  ADM: [],
  SUS: [],
  OBS: [],
};

export const RATINGS = [
  ["SUS", "Suspended"],
  ["OBS", "Observer"],
  ["S1", "Tower Trainee"],
  ["S2", "Tower Controller"],
  ["S3", "Senior Student"],
  ["C1", "Enroute Controller"],
  ["C2", "Controller 2 (not in use)"],
  ["C3", "Senior Controller"],
  ["I1", "Instructor"],
  ["I2", "Instructor 2 (not in use)"],
  ["I3", "Senior Instructor"],
  ["SUP", "Supervisor"],
  ["ADM", "Administrator"],
];

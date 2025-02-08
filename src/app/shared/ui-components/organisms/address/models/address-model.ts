declare var FixedID: number;
export class Address {
  id!: number;
  isSameAddressAsPrimary: boolean;
  streetName: string;
  unit: string;
  postalCode: string;
  provinceId: number;
  regionId: number;
  cityId: number;
  mainIntersection: string;

  city?: {
    id: number;
    name?: string;
  };
  county?: {
    id: number;
    name?: string;
  };
  province?: {
    id: number;
    name?: string;
    code?: string;
  };

  constructor() {
    this.streetName = '';
    this.unit = '';
    this.postalCode = '';
    this.mainIntersection = '';
    this.provinceId = 1;
    this.regionId = FixedID;
    this.cityId = Number();
    this.isSameAddressAsPrimary = false;
  }
}

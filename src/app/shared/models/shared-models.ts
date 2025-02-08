export interface LookupValue {
  id: number;
  name: string;
  regionId?: number;
}

export interface BEResponse<t> {
  data: t;
  metadata: null;
  nextCursor: number;
  totalCount: number;
}

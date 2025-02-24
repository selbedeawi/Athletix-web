export interface BEResponse<t> {
  data: t;
  error: any;
  count: null | number;
  status: number;
  statusText: string;
}

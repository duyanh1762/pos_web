export interface DataRequest{
  mode:string, // get || update || delete || create
  data: string | any,
}

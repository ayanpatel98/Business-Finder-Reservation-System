export interface ipinfoResponse{
    city?: any,
    country?: any,
    hostname?: any,
    ip?: any,
    loc?: any,
    org?: any,
    postal?: any,
    region?: any,
    timezone?: any
}
export interface geoResponse{
    results?: any,
    status?: any,
}
// For Api call
export interface searchTable{
    results?: any,
    status?: any,
}

export interface searchTableData {
    idx?:any,
    categories?: any,
    distance?: any,
    id?: any,
    image_url?: any,
    name?: any,
    rating?: any,
}
export interface submitParams{
    response?: any,
    status?: any,
}
// BusinessDetails
export interface businessDetails {
    idx?:any,
    categories?: any,
    distance?: any,
    id?: any,
    image_url?: any,
    name?: any,
    rating?: any,
}
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
    response?: any
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

// Detail Section
export interface businessDetails {
    categories?: any,
    display_address?: any[],
    display_phone?: any,
    id?: any,
    is_closed?: any,
    is_open_now?:any,
    more_info?: string,
    name?: any,
    photos?: any[],
    price?: any,
    transactions?: any[],
    0?: any,
    coordinates?: any,
}
// Reviews Section
export interface reviews {
    id?: any,
    name?: any,
    rating?: any,
    text?: any,
    time_created?: any,
}
type JobQuery = {
    keyword?: string
    location?: string
    permitSupported?: boolean
    page?: number
    limit?: number
    sort?: string
}
export function buildJobQuery(query: JobQuery){
    const params = new URLSearchParams()
    
    const keyword = query.keyword?.trim()
    const location = query.location?.trim()

    if (keyword) {
        params.set('title', keyword)
    }

    if (location) {
        params.set('location', location)
    }

    if (query.permitSupported) {
        params.set("permitSupported", "true")
    }

    if (query.page) {
        params.set("page", String(query.page))
    }

    if (query.limit) {
        params.set("limit", String(query.limit))
    }

    if (query.sort) {
        params.set("sort", query.sort)
    }

    return params.toString()
}
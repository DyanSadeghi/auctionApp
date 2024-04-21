module.exports = class Tranform {

    transformCollection(items){
        if(this.withPaginateStatus){
            return {
                "items": items.docs.map(this.transform.bind(this)),
                ...this.paginateItem(items)
            }
        }
        return items.map(this.transform.bind(this))
    }

    paginateItem(items){
        return {
            total: items.total,
            limit:items.limit,
            page:items.page,
            pages:items.pages
        };
    }
    withPaginate(){
        this.withPaginateStatus = true
        return this
    }
}
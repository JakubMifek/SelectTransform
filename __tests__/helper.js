function isSameArr(arr) {
    const len = this.length === arr.length;
    if(!len)
        return false;

    const same = this.every(item => arr.some(item2 => {
        if(typeof item !== typeof item2)
            return false;

        switch(typeof item) {
            case 'bigint':
            case 'boolean':
            case 'number':
            case 'string':
            case 'symbol':
            case 'function':
                return item == item2;
            case 'object':
                return item.isSame(item2);
            default:
                console.log('unexpected type in the object');
                return false;
        }
    }));

    return same;
}

export function assert(value, message) {
    if(!value){
        throw new Error(`Assertion error - ${message}`);
    }
}

Array.prototype.isSame = isSameArr;

Object.prototype.isSame = function(obj) {
    this.isSame = isSame;
    obj.isSame = isSame;

    if(!Object.keys(this).isSame(Object.keys(obj)))
        return false;

    for(const key in obj) {
        switch(typeof obj[key]) {
            case 'bigint':
            case 'boolean':
            case 'number':
            case 'string':
            case 'symbol':
            case 'function':
                if(obj[key] != this[key])
                    return false;
                break;
            case 'object':
                if(!obj[key].isSame(this[key]))
                    return false;
                break;
            default:
                console.log('unexpected type in the object');
                return false;
        }
    }
    return true;
}
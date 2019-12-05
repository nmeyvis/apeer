module.exports = {
    removeFirstWhere(array, func) {
        for(let i = 0; i < array.length; i++) {
            let item = array[i];
            if(func(item)) {
                array.splice(i, 1);
                return true;
            }
        }

        return false;
    },

    remove(array, item) {
        this.removeFirstWhere(array, i => i === item);
    },

    findFirstOrElse(array, func, orElse) {
        let item = this.findFirstWhere(array, func);
        return item == null ? orElse : item;
    },

    findFirstWhere(array, func) {
        for(let i = 0; i < array.length; i++) {
            let item = array[i];
            if(func(item)) {
                return item;
            }
        }

        return null;
    }
};
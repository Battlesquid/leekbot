Map.prototype.nestedGet = function (...levels) {
    let map = this.get(levels[0]);
    for (let i = 1; i < levels.length; i++) {
        map = map.get(levels[i]);
    }
    return map || false;
}
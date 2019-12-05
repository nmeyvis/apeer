const DEFAULT_ID_TRUNCATE_LENGTH = 16;

class Room {
    constructor(options) {
        this.id = options.id || null;
        this.isLocked = options.isLocked || false;
        this.hasPassword = options.hasPassword || false;
        this.hostClientId = options.hostClientId || null;
        this.exposedToHostNetwork = options.exposedToHostNetwork || false;
    }

    get roomUrl() {
        return `/${this.id}`;
    }

    truncateRoomId(maxLength = DEFAULT_ID_TRUNCATE_LENGTH) {
        return this.id.substring(0, maxLength);
    }

    wouldTruncateRoomId(maxLength = DEFAULT_ID_TRUNCATE_LENGTH) {
        return this.id.length > maxLength;
    }
}

module.exports = Room;
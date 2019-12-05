class Rooms {

    getRoom(id) {
        return fetch(`${HOSTS.api}/api/rooms/${id}`).then((resp) => {
            if(resp.status === 404) {
                return null;
            } else {
                return resp.json();
            }
        });
    }
}

module.exports = Rooms;
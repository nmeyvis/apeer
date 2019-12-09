const { Room } = require("../src/Rooms.js");
const User = require("../src/User.js");

const MockSocket = {
    handshake: {
        address: "1.2.3.4"
    }
};


describe("Room", function() {

    describe("#secureAdd", function() {

        it("should not add the user if the password is bad", function() {
            let room = new Room("test");
            let user = new User(MockSocket);

            room.setPassword("password123");

            room.secureAdd({
                user,
                password: "badpassword",
                fail: () => {}
            });

            expect(room.isMember(user.clientId)).toBe(false);
        });

        it("should add the user if the password is good", function() {
            let room = new Room("test");
            let user = new User(MockSocket);

            room.setPassword("password123");

            room.secureAdd({
                user,
                password: "password123",
                success: () => {}
            });

            expect(room.isMember(user.clientId)).toBe(true);
        });

        it("should execute the provided 'fail' callback when the password is bad", function() {
            let room = new Room("test");
            room.setPassword("password123");

            let failCallback = jasmine.createSpy();
            let successCallback = jasmine.createSpy();

            room.secureAdd({
                user: {},
                password: "badpassword",
                fail: failCallback,
                success: successCallback
            });

            expect(failCallback).toHaveBeenCalled();
            expect(successCallback).not.toHaveBeenCalled();
        });

        it("should execute the provided 'success' callback when the password is good", function() {
            let room = new Room("test");
            room.setPassword("password123");

            let failCallback = jasmine.createSpy();
            let successCallback = jasmine.createSpy();

            room.secureAdd({
                user: {},
                password: "password123",
                fail: failCallback,
                success: successCallback
            });

            expect(failCallback).not.toHaveBeenCalled();
            expect(successCallback).toHaveBeenCalled();
        });
    });

    describe("#joinedAfter", function() {

        it("should return the user that joined after the given user", function() {
            let room = new Room();
            let user1 = new User(MockSocket);
            let user2 = new User(MockSocket);
            let user3 = new User(MockSocket);

            room.add(user1);
            room.add(user2);
            room.add(user3);

            expect(room.joinedAfter(user2)).toBe(user3);
        });

        it("should return null if the given user was last to join", function() {
            let room = new Room();
            let user1 = new User(MockSocket);
            let user2 = new User(MockSocket);

            room.add(user1);
            room.add(user2);

            expect(room.joinedAfter(user2)).toBe(null);
        });

        it("should return null if the given user is the only user", function() {
            let room = new Room();
            let user1 = new User(MockSocket);

            room.add(user1);

            expect(room.joinedAfter(user1)).toBe(null);
        });
    });
});
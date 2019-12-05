const DEFAULT_STATE = {
    shouldShowOnboarding: true,
    nickname: "peer23424"
};

module.exports = class State {
    constructor() {
        this.state = load();

        function load() {
            let state = localStorage.getItem("state");
            return (state != null) ? JSON.parse(state) : DEFAULT_STATE;
        }
    }

    save() {
        if(!isDebug()) {
            localStorage.setItem("state", JSON.stringify(this.state));
        }
    }

    set(key, value) {
        this.state[key] = value;
        this.save();
    }

    get nickname() {
        return this.state.nickname;
    }
    set nickname(nickname) {
        this.set("nickname", nickname);
    }

    get shouldShowOnboarding() {
        return this.state.shouldShowOnboarding;
    }

    set shouldShowOnboarding(shouldShow) {
        this.set("shouldShowOnboarding", shouldShow);
    }
};

function isDebug() {
    return localStorage.getItem("debug") == "true";
}

function getItemOrElse(key, orElse) {
    let item = localStorage.getItem(key);
    return (item == null) ? orElse : item;
}
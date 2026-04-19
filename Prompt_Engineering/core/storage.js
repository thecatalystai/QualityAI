export class Storage {

    save(prompt) {
        let history = JSON.parse(localStorage.getItem("history") || "[]");

        history.unshift(prompt);

        localStorage.setItem(
            "history",
            JSON.stringify(history.slice(0, 20))
        );
    }

    getAll() {
        return JSON.parse(localStorage.getItem("history") || "[]");
    }
}

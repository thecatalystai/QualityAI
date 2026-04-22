export class Storage {
  static KEY = 'catalyst_prompt_history';
  static MAX  = 20;

  save(prompt) {
    const history = this.getAll();
    history.unshift(prompt);
    localStorage.setItem(Storage.KEY, JSON.stringify(history.slice(0, Storage.MAX)));
  }

  getAll() {
    try {
      return JSON.parse(localStorage.getItem(Storage.KEY) || '[]');
    } catch {
      return [];
    }
  }

  clear() {
    localStorage.removeItem(Storage.KEY);
  }
}

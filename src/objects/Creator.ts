export default class Creator {
  username: string;
  name?: string;
  url?: string;
  email?: string;
  phone?: string;
  country?: string;

  constructor(username: string) {
    this.username = username;
  }
}

export default class Donator {
  name: string;
  email: string;
  phone?: string;
  country?: string;

  constructor({ name, email }: { name: string; email: string }) {
    this.name = name;
    this.email = email;
  }
}

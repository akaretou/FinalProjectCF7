export class RegisterForm {
  constructor(
    public firstname: string,
    public lastname: string,
    public email: string,
    public mobile?: string,
    public password?: string,
    public password2?: string
  ) {}
}

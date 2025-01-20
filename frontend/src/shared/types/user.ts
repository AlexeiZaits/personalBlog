export interface IUser {
    id: string | null,
    firstname: string,
    lastname: string,
}

export interface IFormInput {
    value: string,
    view: boolean
}

export interface IUserForm {
    [key: string]: string | boolean
}

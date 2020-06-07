export class User {
    id: string;
    email: string;
    displayName: string;
    createDate: Date;
    token?: string;
    tokenExpiry?: Date;
}

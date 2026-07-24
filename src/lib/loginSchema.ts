import {email, z} from 'zod';
export const loginSchema = z.object({
    email:z.string().email('invalid email addess'),
    password:z.string().min(6,'password must be at least 6 characters long').regex(/^(?=.*[A-Z])(?=.*\d).+$/, 'password must contain at least one uppercase letter and one number'),

    
    
});
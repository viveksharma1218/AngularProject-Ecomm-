import { AbstractControl,ValidationErrors,ValidatorFn } from "@angular/forms";


export const passwordMatcherValidator:ValidatorFn = 
(control:AbstractControl):ValidationErrors | null =>{

    const password = control.get('password');
    const repeatPassword = control.get('repeatPassword');

    if(!password || !repeatPassword){
        return null;
    }
    if(password.value  !== repeatPassword.value){
        return {passwordMismatch:true}
    }

    return null;

}
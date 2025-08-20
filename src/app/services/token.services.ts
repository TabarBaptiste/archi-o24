import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class TokenService {
    // private readonly storageKey = 'auth_token';
    // private tokenSubject: BehaviorSubject<string | null>(this.getToken());
    // token = this.tokenSubject.asObservable();

    // getToken():string | null {
    //     return localStorage.getItem(this.storageKey);
    // }

    // setToken(token: string): void {
    //     localStorage.setItem(this.storageKey, token);
    //     this.tokenSubject.next(token);
    // }

    // clearToken() {
    //     localStorage.removeItem(this.storageKey);
    //     this.tokenSubject.next(null);
    // }
}
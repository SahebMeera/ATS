import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { IClient, IClientDisplay } from '../../../core/interfaces/client';

@Injectable({ providedIn: 'root' })
export class ClientService {

    addClientApiMethod = "api/Client";
    updateClientApiMethod = "api/Client";
    getClientApiMethod = "api/Client";

    constructor(private http: HttpClient) { }
  
    getClient() {
        return this.http.get<IClientDisplay[]>(`${this.getClientApiMethod}`);
    }
    addClient(client: IClient): Observable<any> {
        return this.http.post<any>(`${this.addClientApiMethod}`, client);
    }
    updateClient(client: IClient): Observable<any[]> {
        return this.http.put<any>(`${this.updateClientApiMethod}/${client.ClientID}`, client);
    }
 
}

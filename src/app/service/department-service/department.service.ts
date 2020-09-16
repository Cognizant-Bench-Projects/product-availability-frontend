import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Department } from 'src/app/model/department';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  url: string = `${environment.productUri}departments`;

  constructor(private http: HttpClient) { }

  getAllDepartments() {
    let httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    
    return this.http.get<Department[]>(this.url, httpOption).toPromise();
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Frame } from '../model/Frame';

@Injectable({
  providedIn: 'root'
})
export class FrameService {

    url = 'http://127.0.0.1:8000'; // api rest fake

    constructor(private httpClient: HttpClient) { }

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    saveFrame(frame: Frame): Observable<Frame> {
        return this.httpClient.post<Frame>(this.url + '/save', JSON.stringify(frame), this.httpOptions)
          .pipe(
            retry(2),
            catchError(this.handleError)
          )
      }

    handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
        // Erro ocorreu no lado do client
        errorMessage = error.error.message;
    } else {
        // Erro ocorreu no lado do servidor
        errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    return throwError(errorMessage);
    };
}

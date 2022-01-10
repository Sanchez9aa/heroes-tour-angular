import { Injectable } from '@angular/core';
import { Hero } from 'src/interfaces/hero';
import { HEROES } from 'src/app/mocks/mock-heroes';
import { Observable, of, zip } from 'rxjs';
import { MessageService } from '../messages/message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HeroService {

  private heroesUrl = 'api/heroes';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private messageService: MessageService) {}

  getHeroes(): Observable<Hero[]> {
    console.log(this.http.get<Hero[]>(this.heroesUrl));
    return this.http.get<Hero[]>(this.heroesUrl).pipe(catchError(this.handleError<Hero[]>('getHeroes', [])));
  }

  getHero(id: number): Observable<Hero> {
    console.log(this.http.get<Hero>(`${this.heroesUrl}/${id}`));
    return this.http.get<Hero>(`${this.heroesUrl}/${id}`).pipe(
      tap((_) => this.log(`Fetched Hero id = ${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  updateHero(updatedHero: Hero): Observable<any>{
    return this.http.put<Hero>(this.heroesUrl, updatedHero, this.httpOptions).pipe(
      tap((_) => this.log(`Updated hero id = ${updatedHero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    )
  }

  addHero(hero: string): Observable<Hero>{
    let newHero = {
      name: hero
    }
    console.log(newHero)
    return this.http.post<Hero>(this.heroesUrl, newHero, this.httpOptions).pipe(
      tap((_) => this.log(`Added hero name = ${hero}`)),
      catchError(this.handleError<Hero>('addHero'))
    )
  }

  deleteHero(id: number): Observable<any>{
    return this.http.delete(`${this.heroesUrl}/${id}`, this.httpOptions).pipe(
      tap((_) => this.log(`Deleted hero id = ${id}`)),
      catchError(this.handleError<any>('deleteHero'))
    )
  }

  searchHeroes(char: string): Observable<Hero[]>{
    if (!char.trim()) return of([])
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${char}`).pipe(
      tap(h => h.length ? this.log(`found heroes matching ${char}`) : this.log(`no heroes matching ${char}`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    )
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}

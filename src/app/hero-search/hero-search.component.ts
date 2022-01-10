import { Component, OnInit } from '@angular/core';
import { HeroService } from '../Services/hero/hero.service';
import { Hero } from 'src/interfaces/hero';
import { Observable, Subject } from 'rxjs';
import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heroes$?: Observable<Hero[]>
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) { }

  search(char: string): void {
    this.searchTerms.next(char)
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((char: string) => this.heroService.searchHeroes(char))
    )
  }

  searchHero(char: string): void {
    this.heroService.searchHeroes(char)
  }
}

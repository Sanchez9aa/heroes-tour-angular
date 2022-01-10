import { Component, OnInit } from '@angular/core';
import { Hero } from 'src/interfaces/hero';
import { HEROES } from '../mocks/mock-heroes';
import { HeroService } from '../Services/hero/hero.service';
import { MessageService } from '../Services/messages/message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private heroService: HeroService) {}

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe((heroes) => (this.heroes = heroes));
  }

  add(hero: string): void {
    hero = hero.trim();
    if (!hero) return;
    this.heroService.addHero(hero).subscribe((hero) => this.heroes.push(hero));
  }

  delete(id: number): void {
    if(!id) return;
    this.heroes = this.heroes.filter(h => h.id !== id)
    this.heroService.deleteHero(id).subscribe()
  }
}

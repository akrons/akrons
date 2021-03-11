import { Injectable, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser'
import { CORE_TITLE_INJECTOR } from '../../injectors';
@Injectable({
  providedIn: 'root'
})
export class TitleService {
  constructor(
    private title: Title,
    @Inject(CORE_TITLE_INJECTOR)
    private prefix?: string,
  ) { }

  public setTitle(title?: string): void {
    const completeTitle = [title, this.prefix].filter(Boolean).join(' - ');
    this.title.setTitle(completeTitle);
  }
}
